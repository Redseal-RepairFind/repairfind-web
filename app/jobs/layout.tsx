import JobsClientLayout from "@/components/jobs/jobs-client-layout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "List job",
  description: "List your job and get bids from professionals on the field",
};

const JobsLayout = ({ children }: { children: ReactNode }) => {
  return <JobsClientLayout>{children}</JobsClientLayout>;
};

export default JobsLayout;
