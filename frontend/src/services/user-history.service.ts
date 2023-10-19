import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3003/api/user/";

export const addHistory = (questionId: string, difficulty: string, attempt: string) => {
  return axios.post(API_URL + "history", {
    questionId,
    difficulty,
    attempt,
  }, 
  { headers: authHeader() });
};
