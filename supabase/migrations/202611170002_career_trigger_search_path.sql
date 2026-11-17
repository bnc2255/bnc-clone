-- The existing applicant-code trigger resolves applicants and format_applicant_code
-- through its caller's search path. Include public so the trigger keeps working.
alter function public.submit_career_application(uuid,jsonb,jsonb,text)
  set search_path = public, pg_temp;
