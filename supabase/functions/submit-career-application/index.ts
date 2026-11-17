import { createClient } from 'npm:@supabase/supabase-js@2.100.1';
import { createHandler } from './handler.mjs';

const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
Deno.serve(createHandler({ client, openaiKey: Deno.env.get('OPENAI_API_KEY') || '' }));
