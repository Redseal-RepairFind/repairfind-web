import ContractorItem from "@/components/contractors/contractor-item";

const SingleContractor = async ({
  params,
}: {
  params: {
    contractorId: string;
  };
}) => {
  const { contractorId } = await params;

  console.log(contractorId);
  return <ContractorItem />;
};

export default SingleContractor;
