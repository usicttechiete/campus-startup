import supabase from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkNotifications() {
    console.log('--- Checking notifications table ---');
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .limit(5);

        if (error) {
            console.error('Error fetching notifications:', error);
            console.log('Suggestion: Ensure the table exists and columns match the model.');
        } else {
            console.log('Successfully connected to notifications table.');
            console.log('Count:', data.length);
            console.log('Sample data:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkNotifications();
