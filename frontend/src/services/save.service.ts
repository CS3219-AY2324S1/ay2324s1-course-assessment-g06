import axios from "axios";

const API_URL = "http://localhost:3002/api/save/";

export const savesession = (code: string, userIds: number[]) => {
  return axios.post(API_URL + "savesession", {
    code,
    userIds,
  });
};
