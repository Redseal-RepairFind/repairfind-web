import Image from "next/image";
import Header from "../ui/header";
import img1 from "@/public/images/cont.jpg";
import img2 from "@/public/images/cont2.jpg";

const PopularJobs = ({ data }: { data: any }) => {
  return (
    <section className="w-full column gap-4 vertical-space">
      <Header header="Recommended Contractors" variant="h3" shade="dark" />

      <div className="grid-3">
        {data?.data?.map((item: any) => (
          <PopularJobsItem item={item} key={item?._id} />
        ))}
      </div>
    </section>
  );
};

export default PopularJobs;

const PopularJobsItem = ({ item }: { item: any }) => {
  // console.log(item);
  return (
    <div className="w-full h-[379px] column gap-4 bg-mygray-50 rounded-b-xl">
      <div className="w-full h-[250px] relative">
        <Image
          src={item?.profilePhoto?.url || img1}
          alt="job images"
          fill
          className="object-cover object-center z-0"
        />
      </div>

      <div className="column gap-2 items-center justify-center ">
        <Header header={item?.name} variant="h3" shade="dark" />
        <p className="message-text">
          Has {item?.profile?.skills?.length} Skills with over{" "}
          {item?.stats?.jobsCompleted <= 1
            ? item?.stats?.jobsCompleted
            : item?.stats?.jobsCompleted - 1}{" "}
          completed jobs
        </p>
      </div>
    </div>
  );
};
