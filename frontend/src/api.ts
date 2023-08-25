import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8765",
  withCredentials: true,
});
