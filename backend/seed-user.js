/* eslint-disable no-console */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// This script manually inserts a user profile with the new required fields.
// Run it from your backend directory with: node seed-user.js

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are missing.');
  console.error('Please ensure your .env file in the backend directory is correctly configured.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Configuration ---
const USER_ID = 'd07aa0ff-b7a6-4ff6-b2a2-946ecd90f793'; // The UUID you provided
const USER_EMAIL = 'test-user@example.com'; // Replace with the actual email if known
const USER_NAME = 'Test User';
const USER_ROLE = 'student'; // 'student' or 'admin'
const USER_COLLEGE = 'Test University';
const USER_COURSE = 'B.Tech';
const USER_BRANCH = 'Computer Science';
const USER_YEAR = 3;
// ---------------------

const seedUser = async () => {
  console.log(`Attempting to insert profile for user ID: ${USER_ID}`);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: USER_ID,
        email: USER_EMAIL,
        name: USER_NAME,
        role: USER_ROLE,
        college: USER_COLLEGE,
        course: USER_COURSE,
        branch: USER_BRANCH,
        year: USER_YEAR,
        // You can add other default fields here if needed
        // level: 'Explorer',
        // trust_score: 0,
      },
    ])
    .select();

  if (error) {
    if (error.code === '23505') { // 23505 is the code for a unique constraint violation
      console.warn('Warning: A profile for this user ID already exists.');
      console.warn('If you are still facing issues, please check the data in your Supabase table.');
    } else {
      console.error('Error inserting user profile:', error.message);
      console.error('Details:', error.details);
    }
    return;
  }

  if (data) {
    console.log('✅ Success! User profile created:');
    console.log(data[0]);
    console.log('\nNow, please refresh the application in your browser.');
  }
};

seedUser();
