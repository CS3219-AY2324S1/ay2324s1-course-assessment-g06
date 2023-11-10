import { useState, useEffect } from 'react';
import axios from 'axios';

const auth_server = process.env.REACT_APP_USR_SVC_AUTH;

const useAdminCheck = (token: string) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(token);
    axios.get(`${auth_server}/verifyAdmin`, {
      headers: { 'x-access-token': token }
    })
    .then(response => {
      setIsAdmin(response.status === 200);
      console.log(response);
    })
    .catch((e) => {
      setIsAdmin(false);
      console.log(e);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [token]);

  return { isAdmin, isLoading };
};

export default useAdminCheck;
