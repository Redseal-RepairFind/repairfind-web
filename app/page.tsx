export const dynamic = "force-dynamic";

import Mhome from "@/components/home/home";
import { contractors } from "@/lib/apis/contractor";

export interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}
const Home = async ({ searchParams }: Props) => {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 20;

  const data = await contractors.getContractors({
    page,
    limit,
    listing: "recommended",
  });

  // console.log(data);

  return <Mhome data={data?.data} />;
};

export default Home;
