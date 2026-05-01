// =============================================
// context/AuthContext.js
// Global authentication state using React Context
// =============================================

import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// AuthProvider wraps the app and gives all children access to auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // logged-in user object
  const [token, setToken] = useState(null);   // JWT token string
  const [loading, setLoading] = useState(true); // wait while checking localStorage

  // On app load, check if user was previously logged in
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser)); // parse the stored JSON string
    }
    setLoading(false); // done checking
  }, []);

  // Called after successful login or signup
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Called when user clicks logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);
