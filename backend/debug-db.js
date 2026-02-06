const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function debug() {
    console.log('--- Checking jobs table ---');
    const { data: jobs, error: jobsError } = await supabase.from('jobs').select('id, role_title').limit(5);
    if (jobsError) console.error('Jobs error:', jobsError);
    else {
        console.log('Jobs count:', jobs.length);
        jobs.forEach(j => console.log(`Job ${j.id}: ${j.role_title}`));
    }

    console.log('\n--- Checking applications table ---');
    const { data: apps, error: appsError } = await supabase.from('applications').select('id, applicant_id, job_id, status');
    if (appsError) console.error('Applications error:', appsError);
    else {
        console.log('Applications count:', apps.length);
        apps.forEach(app => console.log(`App ${app.id}: Applicant ${app.applicant_id}, Job ${app.job_id}, Status ${app.status}`));
    }

    if (apps && apps.length > 0) {
        console.log('\n--- Testing Join ---');
        const { data: joined, error: joinedError } = await supabase
            .from('applications')
            .select('*, job:jobs(*)')
            .eq('applicant_id', apps[0].applicant_id);

        if (joinedError) console.error('Join error:', joinedError);
        else {
            console.log('Joined data sample keys:', Object.keys(joined[0]));
            console.log('Joined job object keys:', Object.keys(joined[0].job || {}));
        }
    } else {
        console.log('\nNo applications found to test join.');
    }

    console.log('\n--- Checking Users table ---');
    const { data: users, error: usersError } = await supabase.from('users').select('id, email, name').limit(5);
    if (usersError) console.error('Users error:', usersError);
    else {
        users.forEach(u => console.log(`User ${u.id}: ${u.email} (${u.name})`));
    }
}

debug();
