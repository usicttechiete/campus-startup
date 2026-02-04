import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getMe } from '../services/user.api.js';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { session } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const fetchRole = useCallback(async () => {
    if (!session) {
      setRole(null);
      return;
    }

    setRoleLoading(true);
    setRoleError(null);
    // eslint-disable-next-line no-console
    console.log('RoleContext: Session found, attempting to fetch user role...');
    try {
      const data = await getMe();
      if (data && data.role) {
        setRole(data.role);
        // eslint-disable-next-line no-console
        console.log('RoleContext: Role fetched successfully:', data.role);
      } else {
        throw new Error('API response did not contain a user role.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('RoleContext: Failed to fetch role.', {
        errorMessage: error.message,
        errorDetails: error.details,
        stack: error.stack,
      });
      setRoleError(error.message || 'Failed to load role');
      setRole(null);
    } finally {
      setRoleLoading(false);
    }
  }, [session]);

  useEffect(() => {
    let ignore = false;

    const fetchRoleWithIgnore = async () => {
      if (!session) {
        setRole(null);
        return;
      }

      setRoleLoading(true);
      setRoleError(null);
      // eslint-disable-next-line no-console
      console.log('RoleContext: Session found, attempting to fetch user role...');
      try {
        const data = await getMe();
        if (!ignore) {
          if (data && data.role) {
            setRole(data.role);
            // eslint-disable-next-line no-console
            console.log('RoleContext: Role fetched successfully:', data.role);
          } else {
            throw new Error('API response did not contain a user role.');
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('RoleContext: Failed to fetch role.', {
          errorMessage: error.message,
          errorDetails: error.details,
          stack: error.stack,
        });
        if (!ignore) {
          setRoleError(error.message || 'Failed to load role');
          setRole(null);
        }
      } finally {
        if (!ignore) {
          setRoleLoading(false);
        }
      }
    };

    fetchRoleWithIgnore();

    return () => {
      ignore = true;
    };
  }, [session]);

  const refreshRole = useCallback(async () => {
    await fetchRole();
  }, [fetchRole]);

  const value = useMemo(
    () => ({
      role,
      roleLoading,
      roleError,
      setRole,
      refreshRole,
    }),
    [role, roleLoading, roleError, refreshRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
