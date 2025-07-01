// utils/publicClient.ts
import axios from "axios";
import { envConfig } from "./env";

const publicClient = () => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  return client;
};
export default publicClient;
