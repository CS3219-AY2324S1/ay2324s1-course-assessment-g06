import axios from "axios";
import authHeader from "./auth-header";

const MATCHING_SERVICE_CORS =
process.env.MATCHING_SERVICE_CORS || 'http://localhost:3002';

const API_URL = `${MATCHING_SERVICE_CORS}/api/save/`;

export const savesession = (questionId: string, difficulty: string, code: string) => {

  const header = authHeader();
  console.log(header);
  return axios.post(API_URL + "savesession", {
    questionId,
    difficulty,
    code,
  }, 
  { headers: header });
};
