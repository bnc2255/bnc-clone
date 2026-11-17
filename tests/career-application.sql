-- Exercises real applicant triggers, transaction behavior, enrichment and grants.
-- All synthetic records and trigger changes roll back.
begin;
do $test$
declare test_id uuid := gen_random_uuid(); result jsonb; second_result jsonb; app_id uuid;
  f jsonb := '{"name":"Integration Test","email":"career-integration@example.invalid","phone":"0000000000","address":"Test","position":"Associate","joiningDate":"2026-12-01","experience":"3"}';
  file_data jsonb := '{"path":"careers/test/resume.pdf","url":"https://example.invalid/test.pdf","name":"test.pdf","size":100}';
begin
  result := public.submit_career_application(test_id,f,file_data,'test-hash');
  if result->>'inserted' <> 'true' then raise exception 'Expected inserted application'; end if;
  select applicant_id into app_id from public.career_applications where id=test_id;
  if not exists(select 1 from public.applicants where id=app_id and source='BNC Global' and full_name='Integration Test' and total_experience='3' and resume_link='https://example.invalid/test.pdf')
    then raise exception 'Applicant mapping failed'; end if;
  second_result := public.submit_career_application(test_id,f,file_data,'test-hash');
  if second_result->>'inserted' <> 'false' then raise exception 'Idempotency failed'; end if;
  begin
    perform public.submit_career_application(test_id,f,file_data,'different-hash');
    raise exception 'Conflict should fail';
  exception when raise_exception then
    if sqlerrm <> 'submission_conflict' then raise; end if;
  end;
  perform public.finish_career_parsing(test_id,'{"candidateName":"Wrong Name","email":"wrong@example.invalid","totalExperience":"10","currentCompany":"Test Co","currentPosition":"Accountant","education":"BCom","skills":"Accounting","certifications":null,"summary":"Test summary"}',null);
  if not exists(select 1 from public.applicants where id=app_id and full_name='Integration Test' and email='career-integration@example.invalid' and total_experience='3' and skills='Accounting' and current_company='Test Co')
    then raise exception 'Enrichment precedence failed'; end if;
  if not exists(select 1 from public.career_applications where id=test_id and parsing_status='completed') then raise exception 'Parsing status failed'; end if;
  if has_table_privilege('anon','public.career_applications','select') then raise exception 'Anonymous read allowed'; end if;
  if has_function_privilege('anon','public.submit_career_application(uuid,jsonb,jsonb,text)','execute') then raise exception 'Anonymous RPC allowed'; end if;
  -- A failed second insert must roll back the new applicant too.
  test_id := gen_random_uuid();
  begin
    perform public.submit_career_application(test_id, f || '{"email":"rollback-test@example.invalid"}'::jsonb, file_data, 'another-hash');
    raise exception 'Duplicate path should fail';
  exception when unique_violation then null;
  end;
  if exists(select 1 from public.applicants where email='rollback-test@example.invalid') then raise exception 'Applicant was orphaned'; end if;
  -- Parsing failure does not remove submitted data.
  result := public.submit_career_application(test_id,f,file_data || '{"path":"careers/test/second.pdf"}'::jsonb,'second-hash');
  perform public.finish_career_parsing(test_id,null,'missing_openai_key');
  if not exists(select 1 from public.career_applications c join public.applicants a on a.id=c.applicant_id
    where c.id=test_id and c.parsing_status='failed' and a.resume_link='https://example.invalid/test.pdf') then raise exception 'Failure lost application'; end if;
end $test$;
rollback;
