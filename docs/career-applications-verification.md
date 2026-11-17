# Careers integration verification — 17 November 2026

## Live backend and browser submission

Submitted a synthetic PDF through the actual careers form in Playwright to the
deployed Supabase Edge Function. The request returned 201. Verified:

- The applicant was saved with source `BNC Global` and the submitted email.
- The complete form and joining date were saved in the linked submission table.
- The stored resume downloaded with HTTP 200 and a `%PDF-` signature.
- GPT-5 Nano parsing completed successfully using the configured server key.
- The synthetic applicant, submission, and storage object were removed afterward;
  independent database checks confirmed all three counts were zero.

A temporary, token-protected QA wrapper verified and removed only the known
synthetic record. It was removed by redeploying the repository's standard
function source immediately after verification.

Live browser calls to the standard deployment confirmed GET returns 405,
JSON submission returns 415, an invalid form returns 400, and anonymous reads
and write-RPC calls are rejected with 401.

## Careers browser checks

- Word files and PDFs over 10 MiB are rejected before submission.
- Native required-field validation blocks an empty form.
- Controls are disabled during a request.
- A simulated upload failure shows its error and preserves entered values.
- Retrying uses the same submission ID and succeeds without another identity.
- Failed parsing still displays submission success.
- Submitting another profile resets the form.
- Desktop and 390-pixel mobile layouts were visually inspected; the mobile page
  has no horizontal overflow.

## Recruitment browser checks

Used authenticated Supabase response fixtures so no real applicant records were
edited during UI testing. Verified sidebar and route access, exact source
filtering, source-lock behavior, search, sorting, pagination, query-error
feedback and recovery, empty results, original submitted details, joining date,
parsing status, resume links, and return navigation.

Verified saved search filters remain separate from the general applicants page.
A fresh browser context without a session redirects to login. Exported and
read back an XLSX with 1,001 rows across two API pages: every source was
`BNC Global`, and joining date and parsing status were included. Selected-row
export contained exactly one selected applicant.

## Automated checks

`npm run test:careers` covers validation, PDF checks, public method handling,
OpenAI request shape and output validation, missing keys, provider failures,
timeouts, enrichment failures, idempotency, concurrent duplicates, upload
failures, definite rollback cleanup, ambiguous commits, request-size bounds,
and frontend multipart submission/error handling.

`tests/career-application.sql` passed against the real database inside a rolled
back transaction, exercising existing applicant triggers, atomic inserts,
idempotency, conflict handling, enrichment precedence, parsing failure retention,
and anonymous privilege restrictions. Deno type checking passed.

All 24 focused automated tests passed. Both production builds passed. The
website's SEO verification passed for 64 static pages, schemas, sitemap, redirects,
missing-route behavior, and mobile content without JavaScript. On Windows, the
existing build needs `PRERENDER_CHROME_PATH` pointing at the installed Chrome
executable rather than its default Linux Chromium binary.

The applicant browser checks include both array and one-to-one object forms of
the embedded submission relationship, including zero years of experience.

Repository-wide lint has existing failures. Comparing the changed Cie_Deck
files with their Git HEAD versions confirms the existing JSX-unused and static
component diagnostics are pre-existing; their error counts are unchanged.
The careers component, submission service, and new admin page pass focused lint.

No frontend has been published by this task.
