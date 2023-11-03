import React, { ReactNode } from 'react';
import useAdminCheck from './useAdminCheck';
import './AdminProtected.css';
import ErrorPage from '../ErrorPage';

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
    return <ErrorPage errorCode='403' />;
  }

  return <>{children}</>;
};

export default AdminProtected;
