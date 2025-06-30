import ContractorsList from "@/components/contractors/contractors";
import { Props } from "../page";
import { contractors } from "@/lib/apis/contractor";

const Contractors = async ({ searchParams }: Props) => {
  const { latitude, longitude, category } = searchParams;

  return (
    <>
      <ContractorsList />;
    </>
  );
};

export default Contractors;
