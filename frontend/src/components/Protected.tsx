import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  isLoggedIn: boolean;
  children: ReactNode;
  redirectPath: string;
}

const Protected: React.FC<ProtectedProps> = ({ isLoggedIn,redirectPath, children }) => {
  // console.log(isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};

export default Protected;
