import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const initialise = async () => {
      setAuthLoading(true);
      const {
        data: { session: activeSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setAuthError(sessionError.message);
      }

      if (!ignore) {
        setSession(activeSession);
        setUser(activeSession?.user ?? null);
        setAuthLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    });

    initialise();

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email, password) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: additionalData
      }
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      session,
      user,
      authLoading,
      authError,
      signInWithPassword,
      signUp,
      signOut,
    }),
    [session, user, authLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
