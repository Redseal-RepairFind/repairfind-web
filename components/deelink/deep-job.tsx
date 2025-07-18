"use client";

import { Jobs } from "@/lib/apis/jobs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeepLinkJobsClient = () => {
  const param = useSearchParams();
  const reference = param.get("reference");
  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => {
    if (!reference) return;

    const getJobByRef = async () => {
      setRedirecting(true);
      try {
        // const job = await Jobs.getJobByReference(reference);
        // const id = job?.data?._id;

        // if (id) {
        const appUrl = `repairfindcontractorapp://job?id=${reference}`;
        const fallbackUrl = {
          android:
            "https://play.google.com/store/apps/details?id=com.krendus.repairfindcontractor",
          ios: "https://apps.apple.com/us/app/repairfind-contractor-pro/id6478470629",
        };

        const fallback = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? fallbackUrl.ios
          : fallbackUrl.android;

        const now = new Date().getTime();

        window.location.replace(appUrl);

        const timeout = setTimeout(() => {
          const elapsed = new Date().getTime() - now;
          if (elapsed < 1500) {
            window.location.replace(fallback);
          }
        }, 2000);

        return () => clearTimeout(timeout);
        // }
      } catch (error: any) {
        console.error("Error fetching job details:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch job details. Please try again later."
        );
      } finally {
        setRedirecting(false);
      }
    };

    getJobByRef();
  }, [reference]);

  return (
    <div className="h-screen w-full flex flex-col gap-4 items-center justify-center px-4">
      <h1>Redirecting to RepairFind Contractor App...</h1>
      <p>If the app doesn’t open, you’ll be redirected shortly.</p>
    </div>
  );
};

export default DeepLinkJobsClient;
