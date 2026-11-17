create table public.career_applications (
  id uuid primary key,
  applicant_id uuid not null unique references public.applicants(id) on delete cascade,
  created_at timestamptz not null default now(),
  form_data jsonb not null,
  joining_date date not null,
  resume_path text not null unique,
  resume_url text not null,
  resume_filename text not null,
  resume_size integer not null check (resume_size > 0 and resume_size <= 10485760),
  request_hash text not null,
  parsing_status text not null default 'pending' check (parsing_status in ('pending','completed','failed')),
  parsing_model text not null default 'gpt-5-nano',
  parsing_error text,
  parsed_data jsonb,
  parsed_at timestamptz
);
alter table public.career_applications enable row level security;
revoke all on public.career_applications from anon, authenticated;
grant select on public.career_applications to authenticated;
grant all on public.career_applications to service_role;
create policy career_admin_read on public.career_applications
  for select to authenticated using (public.is_admin());
create index career_applications_created_idx on public.career_applications(created_at desc);
create index if not exists applicants_source_created_idx on public.applicants(source, created_on desc);

-- Only the Edge Function's service role can write. Both rows commit together.
create function public.submit_career_application(p_id uuid, p_form jsonb, p_file jsonb, p_hash text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  existing public.career_applications;
  new_applicant uuid;
  attempt integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 0));
  select * into existing from public.career_applications where id = p_id;
  if found then
    if existing.request_hash <> p_hash then raise exception 'submission_conflict'; end if;
    return jsonb_build_object('submission_id', existing.id, 'inserted', false,
      'parsing_status', existing.parsing_status, 'resume_path', existing.resume_path);
  end if;
  for attempt in 1..4 loop
    begin
      insert into public.applicants(source, full_name, email, mobile_number, current_location,
        job_applied_for, total_experience, resume_link, uploaded_by)
      values ('BNC Global', p_form->>'name', p_form->>'email', p_form->>'phone', p_form->>'address',
        p_form->>'position', p_form->>'experience', p_file->>'url', 'BNC Global Website')
      returning id into new_applicant;
      exit;
    exception when unique_violation then
      if attempt = 4 then raise; end if;
    end;
  end loop;
  insert into public.career_applications(id, applicant_id, form_data, joining_date, resume_path,
    resume_url, resume_filename, resume_size, request_hash)
  values (p_id, new_applicant, p_form, (p_form->>'joiningDate')::date, p_file->>'path',
    p_file->>'url', p_file->>'name', (p_file->>'size')::integer, p_hash);
  return jsonb_build_object('submission_id', p_id, 'inserted', true, 'parsing_status', 'pending',
    'resume_path', p_file->>'path');
end;
$$;
revoke all on function public.submit_career_application(uuid,jsonb,jsonb,text) from public, anon, authenticated;
grant execute on function public.submit_career_application(uuid,jsonb,jsonb,text) to service_role;

-- Parsed enrichment and parsing state also commit together. Form fields always win.
create function public.finish_career_parsing(p_id uuid, p_parsed jsonb, p_error text)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.career_applications;
begin
  select * into target from public.career_applications where id = p_id for update;
  if not found or target.parsing_status <> 'pending' then return; end if;
  if p_error is null and p_parsed is not null then
    update public.applicants set
      current_company = coalesce(nullif(current_company,''), p_parsed->>'currentCompany'),
      current_position = coalesce(nullif(current_position,''), p_parsed->>'currentPosition'),
      education = coalesce(nullif(education,''), p_parsed->>'education'),
      skills = coalesce(nullif(skills,''), p_parsed->>'skills'),
      certification = coalesce(nullif(certification,''), p_parsed->>'certifications'),
      cv_summary = coalesce(nullif(cv_summary,''), p_parsed->>'summary')
    where id = target.applicant_id;
  end if;
  update public.career_applications set
    parsing_status = case when p_error is null and p_parsed is not null then 'completed' else 'failed' end,
    parsing_error = p_error, parsed_data = p_parsed, parsed_at = now()
  where id = p_id;
end;
$$;
revoke all on function public.finish_career_parsing(uuid,jsonb,text) from public, anon, authenticated;
grant execute on function public.finish_career_parsing(uuid,jsonb,text) to service_role;
