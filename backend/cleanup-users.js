/* eslint-disable no-console */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// This script removes all existing user profiles from the database.
// Run it from your backend directory with: node cleanup-users.js

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are missing.');
  console.error('Please ensure your .env file in the backend directory is correctly configured.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cleanupUsers = async () => {
  console.log('🧹 Starting cleanup of existing user profiles...');

  try {
    // First, get all existing users to show what will be deleted
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name');

    if (fetchError) {
      console.error('Error fetching existing users:', fetchError.message);
      return;
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log('✅ No existing user profiles found. Database is already clean.');
      return;
    }

    console.log(`Found ${existingUsers.length} existing user profile(s):`);
    existingUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name || 'Unnamed'} (${user.email}) - ID: ${user.id}`);
    });

    // Delete all user profiles
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This condition will match all rows

    if (deleteError) {
      console.error('Error deleting user profiles:', deleteError.message);
      return;
    }

    console.log('✅ Successfully removed all existing user profiles.');
    console.log('📝 Note: This only removes profiles from the users table.');
    console.log('   Auth users in Supabase Auth still exist and can create new profiles on login.');
    console.log('   If you want to remove auth users too, do it manually in Supabase dashboard.');

  } catch (error) {
    console.error('Unexpected error during cleanup:', error.message);
  }
};

cleanupUsers();