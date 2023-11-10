import React, { useEffect, useState } from 'react';

interface ErrorPageProps {
  errorCode: '401' | '403' | '404';
}

const errorMessages: Record<ErrorPageProps['errorCode'], { title: string; message: string }> = {
  '401': {
    title: '401 Unauthorised',
    message: 'You are not authorised to view this page. Redirecting to login in ',
  },
  '403': {
    title: '403 Forbidden',
    message: 'You do not have permission to access this page. If you think this is an error, please contact support.',
  },
  '404': {
    title: '404 Not Found',
    message: 'The page you are looking for does not exist. Please check the URL and try again.',
  },
};

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  const error = errorMessages[errorCode];
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (errorCode === '401') {
      const countdownInterval = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        }
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [errorCode, countdown]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{error.title}</h1>
      <p>
        {errorCode === '401' ? `${error.message} ${countdown} seconds.` : error.message}
      </p>
    </div>
  );
};

export default ErrorPage;
