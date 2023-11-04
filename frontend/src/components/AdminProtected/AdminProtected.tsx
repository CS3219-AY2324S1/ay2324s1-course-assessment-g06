import React, { ReactNode } from 'react';
import useAdminCheck from './useAdminCheck';
import './AdminProtected.css';
import ErrorPage from '../ErrorPage';
import CircularProgress from "@mui/material/CircularProgress";

interface AdminProtectedProps {
  token: string;
  children: ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ token, children }) => {
  const { isAdmin, isLoading } = useAdminCheck(token);

  if (isLoading) {
    return <CircularProgress color="inherit" />;
  }

  if (!isAdmin) {
    return <ErrorPage errorCode='403' />;
  }

  return <>{children}</>;
};

export default AdminProtected;
