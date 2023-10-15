import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
    isLoggedIn: boolean;
    children: ReactNode;
  }

const GuestRoute: React.FC<ProtectedProps> = ({ isLoggedIn, children }) => {
    if (isLoggedIn) {
      return <Navigate to="/" />;
    }
    
    return <>{children}</>;
  };
  
  export default GuestRoute;