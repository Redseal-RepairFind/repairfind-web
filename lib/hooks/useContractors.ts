import { useQuery } from "@tanstack/react-query";
import { contractors } from "../apis/contractor";
import { useParams, useSearchParams } from "next/navigation";

export const useContractors = () => {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || undefined;
  const minResponseTime = searchParams?.get("minResponseTime")
    ? Number(searchParams.get("minResponseTime"))
    : undefined;
  const maxDistance = searchParams?.get("maxDistance")
    ? Number(searchParams.get("maxDistance"))
    : undefined;

  const address = searchParams?.get("address") || undefined;
  const latitude = searchParams?.get("latitude")
    ? Number(searchParams.get("latitude"))
    : undefined;
  const longitude = searchParams?.get("longitude")
    ? Number(searchParams.get("longitude"))
    : undefined;
  const maxResponseTime = searchParams?.get("maxResponseTime")
    ? Number(searchParams.get("maxResponseTime"))
    : undefined;

  const minDistance = searchParams?.get("minDistance")
    ? Number(searchParams.get("minDistance"))
    : undefined;
  const experienceYear = searchParams?.get("experienceYear")
    ? Number(searchParams.get("experienceYear"))
    : undefined;

  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const limit = searchParams?.get("limit")
    ? Number(searchParams.get("limit"))
    : 20;

  const sort = searchParams?.get("sort") as "rating" | "-rating" | undefined;
  const searchName = searchParams?.get("searchName") || undefined;
  const country = searchParams?.get("country") || undefined;
  const city = searchParams?.get("city") || undefined;

  const availableDays = searchParams?.get("availableDays") as
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
    | undefined;

  const isOffDuty =
    searchParams?.get("isOffDuty") === "true"
      ? true
      : searchParams?.get("isOffDuty") === "false"
      ? false
      : undefined;

  const date = searchParams?.get("date") || undefined;
  const accountType = searchParams?.get("accountType") || undefined;
  const emergencyJobs =
    searchParams?.get("emergencyJobs") === "true"
      ? true
      : searchParams?.get("emergencyJobs") === "false"
      ? false
      : undefined;
  const listing = searchParams?.get("listing") || undefined;

  const { contractorId } = useParams();

  const {
    data: singlecontractorsData,
    isLoading: isLoadingSingleContravtors,
    refetch: refetchSingleContractors,
    isRefetching: refetchingSingleContractors,
  } = useQuery({
    queryKey: ["single-contractor", contractorId],
    queryFn: () => contractors.getSinglecontractor(contractorId as string),
    enabled: Boolean(contractorId),
  });

  const {
    data: contractorsData,
    isLoading: isLoadingContravtors,
    refetch: refetchContractors,
    isRefetching: refetchingContractors,
  } = useQuery<any>({
    queryKey: [
      "contractors",
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
    ],
    queryFn: () =>
      contractors.getContractors({
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
      }),
  });

  return {
    contractorsData,
    isLoadingContravtors,
    refetchContractors,
    refetchingContractors,
    singlecontractorsData,
    isLoadingSingleContravtors,
    refetchSingleContractors,
    refetchingSingleContractors,
  };
};
