import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login locally for demonstration purposes
  useEffect(() => {
    setTimeout(() => {
      setCurrentUser({ email: 'admin@campus-connect.local', uid: 'local-admin-123' });
      setLoading(false);
    }, 300);
  }, []);

  const login = async (email, password) => {
    // Mock login
    setCurrentUser({ email, uid: 'local-admin-123' });
    return Promise.resolve();
  };

  const logout = async () => {
    // Mock logout
    setCurrentUser(null);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
