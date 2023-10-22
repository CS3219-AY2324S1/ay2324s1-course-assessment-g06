import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.MATCHING_SERVICE_CORS + "/api/save" || "http://localhost:3002/api/save/";

export const savesession = (questionId: string, difficulty: string, code: string) => {
  return axios.post(API_URL + "savesession", {
    questionId,
    difficulty,
    code,
  }, 
  { headers: authHeader() });
};
