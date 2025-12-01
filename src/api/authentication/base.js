import axios from "axios";

const isProduction = process.env.NEXT_PUBLIC_DOMAIN_DEV

export const authKit = axios.create({
  baseURL: isProduction !== "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV 
    : process.env.NEXT_PUBLIC_API_URL_PROD, 
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authKit2 = axios.create({
  baseURL: isProduction !== "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD,
  timeout: 50000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});