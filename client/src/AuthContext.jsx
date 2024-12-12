import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const nav = useNavigate(); // Move useNavigate outside the component

  useEffect(() => {
    // Check if authToken is available in localStorage on component mount
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    // console.log(token);
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    nav("/"); // Navigate here
  };

  return (
    <AuthContext.Provider value={{ authToken, storeToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
