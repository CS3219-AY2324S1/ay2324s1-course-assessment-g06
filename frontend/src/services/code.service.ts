import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_MTC_SVC + "/api/code/";
console.log("CODE EXEC API_URL:" + API_URL);

export const runcode = (code : string, input : string, language : string, fileName : string) => {
  const header = authHeader();

  console.log("API for runcode:" + API_URL + "run");
  return axios.post(API_URL + "run", {
    code,
    input,
    language,
    fileName
  }, 
  { headers: header });
};
