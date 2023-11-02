import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAdminCheck from './useAdminCheck';
import Unauthorised from '../Unauthorised/Unauthorised';
import './AdminProtected.css';  // Import your CSS here

interface AdminProtectedProps {
  token: string;
  children: ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ token, children }) => {
  const { isAdmin, isLoading } = useAdminCheck(token);

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  if (!isAdmin) {
    // return <Navigate to="/login" replace />;
    return <Unauthorised />;
  }

  return <>{children}</>;
};

export default AdminProtected;
