import ContractorsClientLayout from "@/components/contractors/contractors-layout";
import { ReactNode } from "react";

const ContractorsLayout = ({ children }: { children: ReactNode }) => {
  return <ContractorsClientLayout>{children}</ContractorsClientLayout>;
};

export default ContractorsLayout;
