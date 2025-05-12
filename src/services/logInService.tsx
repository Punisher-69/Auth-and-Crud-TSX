import axios, { AxiosRequestConfig } from "axios";
import { ILoginRequest } from "../models/Auth";

const LogIn_Url: string = import.meta.env.VITE_LOG_IN_URL;
const Details_Url: string = import.meta.env.VITE_LOG_IN_DETAILS_URL;

export const authenticateUser = (payLoad: ILoginRequest) => {
  return axios.post(LogIn_Url, payLoad);
};

export const getUserDetails = (header: AxiosRequestConfig) => {
  return axios.get(Details_Url, header);
};
