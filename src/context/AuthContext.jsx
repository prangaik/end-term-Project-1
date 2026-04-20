import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(null, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    // Fallback if the connection hangs
    const timer = setTimeout(() => setLoading(false), 2000);
    
    return () => {
        unsubscribe();
        clearTimeout(timer);
    };
  }, []);

  const logout = () => {
      fbSignOut(null).then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
