import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient.js';

export const useOnlineStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  // Set user as online
  const setOnlineStatus = useCallback(async (online) => {
    if (!userId) {
      return;
    }

    try {
      const updateData = {
        is_online: online,
        last_seen: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating online status:', error);
      } else {
        setIsOnline(online);
        setLastSeen(updateData.last_seen);
      }
    } catch (error) {
      console.error('Error setting online status:', error);
      return;
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Set as online immediately
    setOnlineStatus(true);

    // Set up heartbeat to keep user marked as online
    const interval = setInterval(() => {
      setOnlineStatus(true);
    }, 30000); // Every 30 seconds

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOnlineStatus(false);
      } else {
        setOnlineStatus(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle page unload
    const handleBeforeUnload = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOnlineStatus(false);
    };
  }, [userId, setOnlineStatus]);

  return {
    isOnline,
    lastSeen,
    setOnlineStatus,
  };
};

export const useAvailability = (userId, initialAvailability = false) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailability);
  const [loading, setLoading] = useState(false);

  const toggleAvailability = useCallback(async () => {
    if (!userId || loading) return;

    setLoading(true);
    try {
      const newAvailability = !isAvailable;
      
      const { error } = await supabase
        .from('users')
        .update({ available_to_work: newAvailability })
        .eq('id', userId);

      if (error) {
        console.error('Error updating availability:', error);
        throw error;
      }

      setIsAvailable(newAvailability);
    } catch (error) {
      console.error('Error toggling availability:', error);
      // Revert state on error
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, isAvailable, loading]);

  // Load initial availability
  useEffect(() => {
    if (!userId) return;

    const loadAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('available_to_work')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error loading availability:', error);
        } else if (data) {
          setIsAvailable(data.available_to_work || false);
        }
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, [userId]);

  return {
    isAvailable,
    loading,
    toggleAvailability,
  };
};
