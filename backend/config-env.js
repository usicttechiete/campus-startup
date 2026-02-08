import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: join(__dirname, '.env') });

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('- SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✓ Set' : '✗ Missing');

export {};
