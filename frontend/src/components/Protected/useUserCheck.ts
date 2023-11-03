import { useState, useEffect } from 'react';
import axios from 'axios';

const auth_server = process.env.REACT_APP_USR_SVC_AUTH;

const useAdminCheck = (token: string) => {
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(token);
    axios.get(`${auth_server}/verifyToken`, {
      headers: { 'x-access-token': token }
    })
    .then(response => {
      setIsUser(response.status === 200);
      console.log(response);
    })
    .catch((e) => {
      setIsUser(false);
      console.log(e);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [token]);

  return { isUser, isLoading };
};

export default useAdminCheck;
