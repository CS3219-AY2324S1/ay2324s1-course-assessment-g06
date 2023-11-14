import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_MTC_SVC + "/api/code/";

export const runcode = (code : string, input : string, language : string, fileName : string) => {
  const header = authHeader();

  return axios.post(API_URL + "run", {
    code,
    input,
    language,
    fileName
  }, 
  { headers: header });
};
