// app/page.tsx
export const dynamic = "force-dynamic";

import Mhome from "@/components/home/home";
import { contractors } from "@/lib/apis/contractor";

const Home = async ({ searchParams }: { searchParams?: any }) => {
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 20);

  const data = await contractors.getContractors({
    page,
    limit,
    listing: "recommended",
  });

  return <Mhome data={data?.data} />;
};

export default Home;
