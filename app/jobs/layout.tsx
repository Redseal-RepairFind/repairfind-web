import JobsClientLayout from "@/components/jobs/jobs-client-layout";
import { ReactNode } from "react";

const JobsLayout = ({ children }: { children: ReactNode }) => {
  return <JobsClientLayout>{children}</JobsClientLayout>;
};

export default JobsLayout;
