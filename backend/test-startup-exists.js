import supabase from './config/db.js';

// Test script to verify startup exists and can be used for job posting
async function testStartupExists() {
  try {
    // Replace this with your user ID
    const userId = process.argv[2];
    
    if (!userId) {
      console.error('Usage: node test-startup-exists.js <user_id>');
      process.exit(1);
    }

    console.log('Testing for user ID:', userId);
    console.log('---');

    // 1. Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('❌ User not found:', userError.message);
      process.exit(1);
    }

    console.log('✅ User found:', user);
    console.log('---');

    // 2. Check if user has a startup
    const { data: startups, error: startupError } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (startupError) {
      console.error('❌ Error fetching startups:', startupError.message);
      process.exit(1);
    }

    if (!startups || startups.length === 0) {
      console.log('❌ No startups found for this user');
      console.log('User needs to register a startup first');
      process.exit(1);
    }

    console.log(`✅ Found ${startups.length} startup(s):`);
    startups.forEach((s, i) => {
      console.log(`\n  Startup ${i + 1}:`);
      console.log(`    ID: ${s.id}`);
      console.log(`    Name: ${s.name}`);
      console.log(`    Status: ${s.status}`);
      console.log(`    Created: ${s.created_at}`);
    });
    console.log('---');

    // 3. Check approved startup
    const approvedStartup = startups.find(s => s.status === 'APPROVED');
    
    if (!approvedStartup) {
      console.log('❌ No APPROVED startup found');
      console.log('Startup needs to be approved by admin first');
      process.exit(1);
    }

    console.log('✅ Approved startup found:');
    console.log(`   ID: ${approvedStartup.id}`);
    console.log(`   Name: ${approvedStartup.name}`);
    console.log('---');

    // 4. Test if we can create a job with this startup ID
    console.log('Testing job creation constraint...');
    
    const testJob = {
      company_id: approvedStartup.id,
      role_title: 'TEST - DELETE ME',
      description: 'Test job - should be deleted',
      type: 'Internship',
    };

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert(testJob)
      .select()
      .single();

    if (jobError) {
      console.error('❌ Failed to create test job:', jobError.message);
      console.error('   This is the same error you\'re seeing in the app');
      console.error('   Run: backend/fix-jobs-company-id-constraint.sql');
      process.exit(1);
    }

    console.log('✅ Test job created successfully!');
    console.log(`   Job ID: ${job.id}`);
    console.log('---');

    // 5. Clean up test job
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', job.id);

    if (deleteError) {
      console.error('⚠️  Failed to delete test job:', deleteError.message);
      console.log('   Please manually delete job with ID:', job.id);
    } else {
      console.log('✅ Test job deleted successfully');
    }

    console.log('---');
    console.log('🎉 All tests passed! Job posting should work.');
    console.log(`   Use startup ID: ${approvedStartup.id}`);
    console.log(`   Startup name: ${approvedStartup.name}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testStartupExists();
