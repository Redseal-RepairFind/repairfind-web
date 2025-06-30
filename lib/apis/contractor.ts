import publicClient from "../api";

const client = publicClient();

const url = "/common/explore-contractors";

export type ContractorsType = {
  address?: string;
  minResponseTime?: number;
  maxResponseTime?: number;
  city?: string;
  country?: string;
  searchName?: string;
  sort?: "rating" | "-rating";
  limit: number;
  page: number;
  listing?: string;
  emergencyJobs?: boolean;
  category?: string;
  accountType?: string;
  date?: string;
  isOffDuty?: boolean;
  availableDays?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  experienceYear?: number;
  minDistance?: number;
  maxDistance?: number;
  longitude?: number;
  latitude?: number;
};
export const contractors = {
  getContractors: async ({
    address,
    minResponseTime,
    maxResponseTime,
    city,
    country,
    searchName,
    sort,
    limit,
    page,
    listing,
    emergencyJobs,
    category,
    accountType,
    date,
    isOffDuty,
    availableDays,
    experienceYear,
    minDistance,
    maxDistance,
    longitude,
    latitude,
  }: ContractorsType) => {
    try {
      const queryParams = {
        limit,
        page,
        ...(address && { address }),
        ...(minResponseTime !== undefined && { minResponseTime }),
        ...(maxResponseTime !== undefined && { maxResponseTime }),
        ...(city && { city }),
        ...(country && { country }),
        ...(searchName && { searchName }),
        ...(sort && { sort }),
        ...(listing && { listing }),
        ...(emergencyJobs !== undefined && { emergencyJobs }),
        ...(category && { category }),
        ...(accountType && { accountType }),
        ...(date && { date }),
        ...(isOffDuty !== undefined && { isOffDuty }),
        ...(availableDays && { availableDays }),
        ...(experienceYear !== undefined && { experienceYear }),
        ...(minDistance !== undefined && { minDistance }),
        ...(maxDistance !== undefined && { maxDistance }),
        ...(longitude !== undefined && { longitude }),
        ...(latitude !== undefined && { latitude }),
      };
      console.log("Final request query params:", queryParams);

      const response = await client.get(url, {
        params: queryParams,
      });

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

  getSinglecontractor: async (id: string) => {
    try {
      const response = await client.get(`${url}/${id}`);

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
