import React, { createContext, useState, useContext, useEffect } from "react";
import { callAccount } from "../config/api";
import LoadingSpinner from "../pages/LoadingSpiner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAccount = async () => {
    setLoading(true);
    const response = await callAccount();
    if (response.success) {
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleAccount();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
