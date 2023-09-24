import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  isLoggedIn: boolean;
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Protected;
