import React, { ReactNode } from 'react';
import useAdminCheck from './AdminCheck';
import ErrorPage from '../../pages/Error';
import CircularProgress from "@mui/material/CircularProgress";

interface AdminProtectedProps {
  token: string;
  children: ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ token, children }) => {
  const { isAdmin, isLoading } = useAdminCheck(token);

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <CircularProgress color="inherit" />
    </div>;
  }

  if (!isAdmin) {
    return <ErrorPage errorCode='403' />;
  }

  return <>{children}</>;
};

export default AdminProtected;
