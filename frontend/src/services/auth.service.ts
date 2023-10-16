import axios from "axios";

const API_URL = process.env.REACT_APP_USER_SVC_URL;
// const API_URL = "http://localhost:3003/api/auth/";

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

export const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};

export const deleteUser = () => {
  const user = getCurrentUser(); // Get current user details
  if (!user || !user.accessToken) {
    throw new Error("No access token found");
  }
  
  // Axios DELETE request with JWT token in the header
  return axios.delete(API_URL + "removeuser", {
    headers: {
      'x-access-token': user.accessToken
    }
  }).catch(err => {console.log(err)});
};
