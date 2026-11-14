import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there's no user in the context, boot them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component (like Dashboard or Nutrition)
  return children;
};

export default ProtectedRoute;