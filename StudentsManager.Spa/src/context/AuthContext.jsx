import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));
  const isLoggedIn = Boolean(userId);

  const login = (newUserId) => {
    sessionStorage.setItem('userId', newUserId);
    setUserId(newUserId);
  };

  const logout = () => {
    sessionStorage.removeItem('userId');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};