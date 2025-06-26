// utils/publicClient.ts
import axios from "axios";
import { envConfig } from "./env";

const publicClient = axios.create({
  baseURL: envConfig.apiURL,
  headers: {
    "Cache-Control": "no-cache",
  },
});

export default publicClient;
