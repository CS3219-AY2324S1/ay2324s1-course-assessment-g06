import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_USER_SVC_URL;
// const API_URL = "http://localhost:3003/api/auth/";

export const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

export const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

export const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

export const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

export const getUserProfile = (token: string) => {
  return axios.get(API_URL + "getuser", {
    headers: {
      "x-access-token": token,
    },
  });
};

export const updateUserProfile = (values: any, token: string) => {
  return axios.patch(API_URL + "updateprofile", values, {
    headers: {
      "x-access-token": token,
    },
  });
};

export const updateUserPassword = (data: any, token: string) => {
  return axios.patch(API_URL + "updatepassword", data, {
    headers: {
      "x-access-token": token,
    },
  });
};
