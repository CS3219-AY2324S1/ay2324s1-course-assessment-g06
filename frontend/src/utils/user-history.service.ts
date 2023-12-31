import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_USR_SVC_HIST
  ? process.env.REACT_APP_USR_SVC_HIST
  : "http://localhost:3003/api/hist";

export const addHistory = (questionId: string, difficulty: string, attempt: string) => {
  return axios.post(API_URL + "/save", {
    questionId,
    difficulty,
    attempt,
  }, 
  { headers: authHeader() });
};
