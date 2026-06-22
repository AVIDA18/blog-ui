/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext(null);

function parseToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      username: payload.username,
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const user = useMemo(() => parseToken(token), [token]);

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading: false,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'Admin',
  }), [user, token, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
