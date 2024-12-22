import React, { createContext, useState, useContext } from "react";

// Tạo Context
const AuthContext = createContext();

// Provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
