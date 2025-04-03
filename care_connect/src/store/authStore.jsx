import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  // Check authentication on initial load and whenever token changes
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserType(decodedToken.userType || null);
        setIsAuthenticated(true);
      } catch (err) {
        setUserType(null);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken"); // Clear invalid token
      }
    } else {
      setUserType(null);
      setIsAuthenticated(false);
    }
  };

  // Add login function to update context state
  const login = (token) => {
    localStorage.setItem("accessToken", token);
    checkAuth();
  };

  // Add logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user-storage");
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        isAuthenticated,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };