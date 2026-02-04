import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient.js';

const DebugOnlineStatus = ({ userId }) => {
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!userId) {
      setDbStatus('No userId provided');
      return;
    }

    const checkDatabase = async () => {
      try {
        console.log('Debug: Checking database for userId:', userId);
        
        // Check if user exists and get current status
        const { data, error } = await supabase
          .from('users')
          .select('id, is_online, last_seen, available_to_work, email')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Debug: Database error:', error);
          setDbStatus(`Error: ${error.message}`);
        } else if (data) {
          console.log('Debug: User data:', data);
          setUserInfo(data);
          setDbStatus('Connected');
        } else {
          setDbStatus('User not found');
        }
      } catch (err) {
        console.error('Debug: Exception:', err);
        setDbStatus(`Exception: ${err.message}`);
      }
    };

    checkDatabase();
  }, [userId]);

  const testUpdate = async () => {
    if (!userId) return;
    
    try {
      console.log('Debug: Testing update...');
      const { error } = await supabase
        .from('users')
        .update({ 
          is_online: true,
          last_seen: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Debug: Update error:', error);
        alert(`Update failed: ${error.message}`);
      } else {
        console.log('Debug: Update successful');
        alert('Update successful! Check console.');
        // Refresh data
        window.location.reload();
      }
    } catch (err) {
      console.error('Debug: Update exception:', err);
      alert(`Update exception: ${err.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h4 className="font-bold text-sm mb-2">Debug Online Status</h4>
      <div className="text-xs space-y-1">
        <p><strong>User ID:</strong> {userId ? userId.substring(0, 8) + '...' : 'None'}</p>
        <p><strong>DB Status:</strong> <span className={dbStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}>{dbStatus}</span></p>
        {userInfo && (
          <>
            <p><strong>Is Online:</strong> {userInfo.is_online ? 'Yes' : 'No'}</p>
            <p><strong>Last Seen:</strong> {userInfo.last_seen ? new Date(userInfo.last_seen).toLocaleTimeString() : 'Never'}</p>
            <p><strong>Available:</strong> {userInfo.available_to_work ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>
      <button
        onClick={testUpdate}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        Test Update
      </button>
    </div>
  );
};

export default DebugOnlineStatus;
