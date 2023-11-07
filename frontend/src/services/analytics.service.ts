import axios from "axios";
import authHeader from "../services/auth-header";

const USER_HISTORY =
  process.env.REACT_APP_USR_SVC_HIST || "http://localhost:3003/api/hist";
const QUESTION_HOST =
  process.env.REACT_APP_QNS_SVC || "http://localhost:3000/api/questions";

export const fetchUserHistory = () => {
  return axios.get(USER_HISTORY + "/get", { headers: authHeader() });
};

export const fetchAttemptedQuestions = (questionId: string[]) => {
  return axios.post(
    QUESTION_HOST + "/questionbyid",
    { ids: questionId },
    {
      headers: authHeader(),
    }
  );
};

export const fetchUserAttemptsDates = () => {
  return axios.get(USER_HISTORY + "/attempts", { headers: authHeader() });
};

export const fetchQuestionsDetails = () => {
  return axios.get(QUESTION_HOST + "/total", { headers: authHeader() });
};
