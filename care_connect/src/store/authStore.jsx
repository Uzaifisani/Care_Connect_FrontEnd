import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    checkAuth();

    // Set an interval to check token expiry every minute
    const interval = setInterval(() => {
      checkAuth();
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        setUserType(decodedToken.userType || null);
        setIsAuthenticated(true);
      } catch (err) {
        logout(); // Invalid token
      }
    } else {
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user-storage");
    setIsAuthenticated(false);
    setUserType(null);
  };

  // Axios Response Interceptor to Handle Expired Tokens
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout(); // Auto-logout on unauthorized response
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        isAuthenticated,
        login,
        logout,
        checkAuth,
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