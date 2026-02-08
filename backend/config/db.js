import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  const error = new Error('Supabase URL or Service Key is missing from environment variables');
  console.error('ERROR: Failed to initialize Supabase client:');
  console.error('- SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('- SUPABASE_SERVICE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  console.error('\nPlease ensure your .env file contains both variables:');
  console.error('SUPABASE_URL=your_supabase_url');
  console.error('SUPABASE_SERVICE_KEY=your_supabase_service_key');
  throw error;
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
