# Careers applications

The careers form submits a multipart POST to
`https://bvvqyjqokvnttbgyjkrt.supabase.co/functions/v1/submit-career-application`.
This is an anonymous application endpoint; it does not require a browser API key.
The function accepts OPTIONS preflight requests. Other methods return 405.

## Request and response

Fields: `submissionId` (UUID v4), `name`, `email`, `phone`, `address`, `position`
(`Intern`, `Associate`, `Consultant`, or `Manager`), `joiningDate` (YYYY-MM-DD),
`experience`, and `resume` (nonempty PDF, maximum 10 MiB).
Do not set Content-Type manually: the browser supplies the multipart boundary.

A new submission returns HTTP 201 with `{ submissionId, parsingStatus }`.
A retry of the same ID and payload returns HTTP 200 without another applicant or
OpenAI call. Reusing an ID for different content returns 409. Validation failures
return 400/413/415; storage or persistence failures return 503 with `{ error }`.
Retry uncertain network outcomes with the same submission ID and file.

## Persistence and parsing

The PDF is stored in the existing **public** `resumes` bucket under a unique
`careers/<submissionId>/<randomId>.pdf` path. Anyone holding its URL can download
it. The original filename is retained as metadata, not used as an object path.

`submit_career_application` creates `applicants` and `career_applications` in one
transaction. The applicant source is always **BNC Global**. Submitted name,
email, phone, address, experience, and position are authoritative. The full form,
joining date, file metadata, request hash, and parsing state live in
`career_applications`. Existing applicant-code and matching/dashboard triggers
continue to run. Only service_role can execute either write RPC.

After persistence, the function calls the OpenAI Responses API with
`gpt-5-nano`, PDF input, strict JSON schema, `store: false`, and a 45-second
provider timeout. Parsed education, company, current position, skills,
certifications, and summary fill otherwise-empty applicant fields. All validated
extracted fields are retained in `parsed_data`. Unknown values remain null.

Configure **OPENAI_API_KEY** under the **Supabase job project's Edge Function
Secrets**, not in either website's VITE environment. Supabase supplies
SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the function. No provider or service
key belongs in the browser. Changing this key does not require frontend changes.

Missing keys, provider failures, and enrichment failures **do not reject an
already saved application**. They record failed parsing and return success.
There is no automatic parsing retry. Transport interruptions after a database
commit can leave parsing pending; the application and PDF remain saved. Logs
contain fixed event codes, never candidate contents or provider response bodies.

## Recruitment app

`Cie_Deck` has a protected `/admin/bnc-global-applicants` route, linked from the
sidebar as **BNC Global Applicants**. It reuses the existing applicants view,
enforces exact source equality for listings/counts/exports, and isolates saved
filters from the general applicants page. Exports page through all matching
records rather than stopping at Supabase's 1,000-row response limit.

The list shows joining date and parsing status. Existing applicant detail pages
show the original form in a BNC Global Application section and preserve the
return path to the dedicated list. Active administrators use existing RLS access.

## Deploy and verify

Apply migrations in order from `supabase/migrations`, then deploy
`supabase/functions/submit-career-application` with JWT verification disabled.
When deploying through Supabase MCP, pass `entrypoint_path: "index.ts"` and
`import_map_path: "deno.json"` explicitly, including index.ts, handler.mjs, and
deno.json. The explicit import-map path avoids a redeploy path-resolution error.
Commit the Deno lockfile for repeatable local dependency checks.

Run `npm run test:careers`,
`deno check --config supabase/functions/submit-career-application/deno.json supabase/functions/submit-career-application/index.ts`,
and both repositories' production builds. `tests/career-application.sql` exercises
the actual database transaction, triggers, idempotency, field precedence, failure
retention, and anonymous grants inside a transaction that rolls back.

Backend changes are deployed to Supabase. Frontend changes must be published
through each site's normal release workflow; this task does not publish them.
