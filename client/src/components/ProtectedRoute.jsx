import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" onNavigate={loginWithRedirect} />
  );
};

export default ProtectedRoute;
