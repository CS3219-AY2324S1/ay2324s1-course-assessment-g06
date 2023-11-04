import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useUserCheck from './useUserCheck';
import ErrorPage from '../ErrorPage';
import { logout } from '../../services/auth.service';
import './Protected.css';
import CircularProgress from "@mui/material/CircularProgress";


interface userProtectedProps {
  token: string;
  children: ReactNode;
}

const Protected: React.FC<userProtectedProps> = ({ token, children }) => {

  const { isUser, isLoading } = useUserCheck(token);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // If the user is not authenticated but has a token, set a timeout for logout and refresh + refresh
    if (!isUser && token) {
      const timeoutId = setTimeout(() => {
        logout(); // Call logout from auth service
        setShouldRedirect(true); // Trigger state change for redirect
      }, 5000);

      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [isUser, token]);

  // Redirect to login after logout
  if (shouldRedirect) {
    window.location.href = '/login'; // This navigates and refreshes the page to login
    return null;
  }
  if (token === "") {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress color="inherit" />
  </div>;
  }

  if (!isUser) {
    return <ErrorPage errorCode='401' />;
  }

  return <>{children}</>;
};

export default Protected;
