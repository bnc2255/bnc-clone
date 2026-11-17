export const CAREER_API_URL = 'https://bvvqyjqokvnttbgyjkrt.supabase.co/functions/v1/submit-career-application'
export const MAX_RESUME_BYTES = 10 * 1024 * 1024

export async function submitCareerApplication(values, submissionId, fetcher = fetch) {
  const body = new FormData()
  for (const key of ['name', 'email', 'phone', 'address', 'position', 'joiningDate', 'experience']) {
    body.append(key, values[key].trim())
  }
  body.append('submissionId', submissionId)
  body.append('resume', values.cv)
  let response
  try {
    response = await fetcher(CAREER_API_URL, { method: 'POST', body, signal: AbortSignal.timeout(90000) })
  } catch {
    throw new Error('Connection interrupted. Please retry with the same details; your application will only be saved once.')
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Unable to submit your application. Please try again.')
  if (!payload.submissionId) throw new Error('Unable to confirm your application. Please try again.')
  return payload
}
