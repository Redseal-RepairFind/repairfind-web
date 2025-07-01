import { PredictionsType } from "@/components/home/places-autocomplete";
import publicClient from "../api";

const client = publicClient();

type PayloaListingType = {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  phoneNumber?: {
    code: string;
    number: string;
  };
  category: string;
  location: PredictionsType;
  media: string[];
  voiceDescription?: {
    url: string;
  };
};

const url = "/common";
export const Jobs = {
  listJob: async (payload: PayloaListingType) => {
    try {
      const response = await client.post(`${url}/create-job-listing`, payload);

      return response.data;
    } catch (error: any) {
      console.error(
        "Axios error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },
};
