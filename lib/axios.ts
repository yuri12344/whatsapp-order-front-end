import axiosLib from "axios";
import { useProModal } from "@/hooks/use-pro-modal";

export const axios = axiosLib.create({});

axios.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    if (error?.response?.status == 403) {
      useProModal.getState().onOpen();
    } 
    return Promise.reject(error);
  }
);
