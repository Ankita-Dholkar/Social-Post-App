import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we read localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("socialUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("socialUser");
      }
    }
    setLoading(false);
  }, []);

  // Called after successful login/signup
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("socialUser", JSON.stringify(userData));
  };

  // Called on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("socialUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
