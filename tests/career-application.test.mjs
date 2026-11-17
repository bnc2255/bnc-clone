import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, parseResume, validateApplication, MAX_PDF_BYTES } from '../supabase/functions/submit-career-application/handler.mjs';
import { submitCareerApplication } from '../src/services/careerApplication.js';

const id = '0a6bfa20-96d0-48b0-862e-c1961cd229aa';
const fields = { name: 'Test Candidate', email: 'TEST@example.com', phone: '+91 9999999999', address: 'Test City',
  position: 'Associate', joiningDate: '2026-12-01', experience: '3' };
const pdf = () => new File(['%PDF-1.4\nTest resume\n%%EOF'], 'resume.pdf', { type: 'application/pdf' });
function form(overrides = {}, file = pdf()) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...fields, submissionId: id, ...overrides })) data.set(key, value);
  data.set('resume', file);
  return data;
}
const request = data => new Request('https://example.test/apply', { method: 'POST', body: data || form() });
const parsed = Object.fromEntries(['candidateName', 'email', 'contactNumber', 'currentLocation', 'education', 'totalExperience',
  'currentCompany', 'currentPosition', 'skills', 'certifications', 'summary'].map(key => [key, key === 'skills' ? 'Accounting' : null]));
const provider = value => new Response(JSON.stringify({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }] }));

function fixture(options = {}) {
  const state = { record: options.record || null, uploads: [], removals: [], finishes: [], calls: [], logs: [] };
  const client = {
    storage: { from: () => ({
      upload: async path => { state.uploads.push(path); return { error: options.uploadError || null }; },
      remove: async paths => { state.removals.push(...paths); return { error: null }; },
      getPublicUrl: path => ({ data: { publicUrl: `https://example.test/resumes/${path}` } }),
    }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: state.record, error: null }) }) }) }),
    rpc: async (name, args) => {
      state.calls.push({ name, args });
      if (name === 'finish_career_parsing') {
        state.finishes.push(args);
        if (options.enrichmentError && args.p_parsed) return { error: { code: 'XX000' } };
        state.record.parsing_status = args.p_error ? 'failed' : 'completed';
        return { error: null };
      }
      if (options.persistenceError) return { error: { code: options.persistenceError === true ? '23514' : options.persistenceError } };
      if (options.concurrentWinner) {
        state.record = { id: args.p_id, request_hash: args.p_hash, parsing_status: 'pending', resume_path: 'careers/winner.pdf' };
        return { data: { inserted: false, parsing_status: 'pending', resume_path: state.record.resume_path } };
      }
      state.record = { id: args.p_id, request_hash: args.p_hash, parsing_status: 'pending', resume_path: args.p_file.path };
      if (options.ambiguousCommit) throw new Error('transport failed after commit');
      return { data: { submission_id: args.p_id, inserted: true, parsing_status: 'pending', resume_path: args.p_file.path } };
    },
  };
  const handler = createHandler({ client, openaiKey: options.key || '', fetcher: options.fetcher || (async () => provider(parsed)), log: value => state.logs.push(value) });
  return { state, handler };
}

test('validates and normalizes form details', async () => {
  const result = await validateApplication(form());
  assert.equal(result.form.email, 'test@example.com');
  assert.equal(result.hash.length, 64);
});

for (const [label, changes] of Object.entries({ 'missing field': { name: ' ' }, 'invalid email': { email: 'bad' },
  'invalid position': { position: 'CEO' }, 'impossible date': { joiningDate: '2026-02-30' }, 'invalid ID': { submissionId: '123' } })) {
  test(`rejects ${label}`, async () => assert.rejects(validateApplication(form(changes)), error => error.status === 400));
}
test('rejects empty, oversized and disguised PDFs', async () => {
  for (const file of [new File([], 'empty.pdf'), new File([new Uint8Array(MAX_PDF_BYTES + 1)], 'big.pdf'), new File(['not PDF'], 'fake.pdf'), new File(['%PDF-'], 'resume.doc')]) {
    await assert.rejects(validateApplication(form({}, file)), error => error.status === 400);
  }
});
test('OPTIONS supports browsers and GET cannot submit', async () => {
  const { handler } = fixture();
  assert.equal((await handler(new Request('https://example.test', { method: 'OPTIONS' }))).status, 204);
  assert.equal((await handler(new Request('https://example.test'))).status, 405);
});
test('missing key still saves applicant and resume and records failed parsing', async () => {
  const { handler, state } = fixture();
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal((await response.json()).parsingStatus, 'failed');
  assert.equal(state.uploads.length, 1);
  assert.equal(state.calls[0].args.p_form.name, fields.name);
  assert.equal(state.finishes[0].p_error, 'missing_openai_key');
  assert.equal(state.removals.length, 0);
});
test('success uses GPT-5 nano with PDF input, structured schema and store false', async () => {
  let sent;
  const { handler, state } = fixture({ key: 'test-key', fetcher: async (_url, options) => { sent = JSON.parse(options.body); return provider(parsed); } });
  assert.equal((await handler(request())).status, 201);
  assert.equal(sent.model, 'gpt-5-nano');
  assert.equal(sent.store, false);
  assert.equal(sent.input[0].content[0].type, 'input_file');
  assert.equal(sent.text.format.strict, true);
  assert.equal(state.finishes[0].p_parsed.skills, 'Accounting');
});
for (const [label, fetcher] of Object.entries({ rate_limit: async () => new Response('', { status: 429 }),
  timeout: async () => { throw new DOMException('Timed out', 'TimeoutError'); },
  invalid_output: async () => provider({ unexpected: 'value' }),
  provider_failure: async () => new Response('', { status: 500 }) })) {
  test(`${label} preserves saved application`, async () => {
    const { handler, state } = fixture({ key: 'test-key', fetcher });
    const response = await handler(request());
    assert.equal(response.status, 201);
    assert.equal((await response.json()).parsingStatus, 'failed');
    assert.ok(state.record);
    assert.equal(state.removals.length, 0);
  });
}
test('enrichment failure preserves application and marks parsing failed', async () => {
  const { handler, state } = fixture({ key: 'test-key', enrichmentError: true });
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal(state.finishes[1].p_error, 'enrichment_failed');
  assert.equal(state.removals.length, 0);
});
test('retry is idempotent and changed details with the same ID are rejected', async () => {
  const { handler, state } = fixture();
  await handler(request());
  assert.equal((await handler(request())).status, 200);
  assert.equal(state.uploads.length, 1);
  assert.equal((await handler(request(form({ name: 'Different' })))).status, 409);
});
test('definite database failure cleans the orphan upload', async () => {
  const { handler, state } = fixture({ persistenceError: true });
  assert.equal((await handler(request())).status, 503);
  assert.deepEqual(state.removals, state.uploads);
});
test('ambiguous commit preserves referenced resume and returns saved submission', async () => {
  const { handler, state } = fixture({ ambiguousCommit: true });
  assert.equal((await handler(request())).status, 200);
  assert.equal(state.removals.length, 0);
});
test('concurrent duplicate removes only its own redundant upload', async () => {
  const { handler, state } = fixture({ concurrentWinner: true });
  assert.equal((await handler(request())).status, 200);
  assert.deepEqual(state.removals, state.uploads);
  assert.equal(state.record.resume_path, 'careers/winner.pdf');
  assert.equal(state.finishes.length, 0);
});
test('unknown database transport outcome retains the PDF for reconciliation', async () => {
  const { handler, state } = fixture({ persistenceError: 'NETWORK' });
  assert.equal((await handler(request())).status, 503);
  assert.equal(state.removals.length, 0);
});
test('rejects oversized request before reading or uploading it', async () => {
  const { handler, state } = fixture();
  const response = await handler(new Request('https://example.test', { method: 'POST', body: 'oversized',
    headers: { 'content-type': 'multipart/form-data; boundary=test', 'content-length': String(MAX_PDF_BYTES + 65537) } }));
  assert.equal(response.status, 413);
  assert.equal(state.uploads.length, 0);
});
test('upload failure does not insert database records', async () => {
  const { handler, state } = fixture({ uploadError: true });
  assert.equal((await handler(request())).status, 503);
  assert.equal(state.calls.length, 0);
});
test('parser rejects incomplete responses', async () => {
  await assert.rejects(parseResume('https://example.test/resume.pdf', 'test', async () => new Response('{"status":"incomplete"}')), /openai_incomplete/);
});
test('frontend posts the file and submission reference, and surfaces API errors', async () => {
  const values = { ...fields, cv: pdf() };
  const result = await submitCareerApplication(values, id, async (_url, options) => {
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('resume').name, 'resume.pdf');
    assert.equal(options.body.get('submissionId'), id);
    return Response.json({ submissionId: id });
  });
  assert.equal(result.submissionId, id);
  await assert.rejects(submitCareerApplication(values, id, async () => Response.json({ error: 'Upload failed' }, { status: 503 })), /Upload failed/);
});
