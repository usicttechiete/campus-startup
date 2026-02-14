/**
 * Migration script to add social media URL fields to users table
 * Run with: node add-social-urls-migration.js
 */

import supabase from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        console.log('🚀 Running migration: Add social media URL fields...\n');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'add-social-urls.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📄 SQL to execute:');
        console.log(sql);
        console.log();

        // Execute the migration
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            // If rpc doesn't exist, try direct execution
            console.log('ℹ️  RPC method not available, trying direct execution...\n');

            // Split by semicolon and execute each statement
            const statements = sql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
                console.log(`Executing: ${statement.substring(0, 50)}...`);
                const { error: execError } = await supabase.rpc('exec', { query: statement });

                if (execError) {
                    console.error('❌ Error:', execError.message);
                    throw execError;
                }
            }
        }

        console.log('✅ Migration completed successfully!');
        console.log('\nThe following fields have been added to the users table:');
        console.log('  - linkedin_url (TEXT)');
        console.log('  - github_url (TEXT)');
        console.log('  - leetcode_url (TEXT)');
        console.log('\n📝 You can now update your profile to add these social links!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\n⚠️  Manual Steps Required:');
        console.log('1. Go to your Supabase Dashboard');
        console.log('2. Navigate to: SQL Editor');
        console.log('3. Run the contents of add-social-urls.sql');
        console.log('\nOr run these commands directly in Supabase SQL Editor:');
        console.log('```sql');
        console.log(fs.readFileSync(path.join(__dirname, 'add-social-urls.sql'), 'utf8'));
        console.log('```');
        process.exit(1);
    }
}

runMigration();
