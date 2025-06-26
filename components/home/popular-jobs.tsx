import Image from "next/image";
import Header from "../ui/header";
import img1 from "@/public/images/cont.jpg";
import img2 from "@/public/images/cont2.jpg";

const PopularJobs = () => {
  return (
    <section className="w-full column gap-4 vertical-space">
      <Header header="Popular jobs" variant="h3" shade="dark" />

      <div className="grid-3">
        <PopularJobsItem
          item={{
            image: img1,
            job: {
              name: "Decks",
            },
            count: 50,
          }}
        />
        <PopularJobsItem
          item={{
            image: img2,
            job: {
              name: "Flooring",
            },
            count: 150,
          }}
        />
        <PopularJobsItem
          item={{
            image: img2,
            job: {
              name: "Flooring",
            },
            count: 150,
          }}
        />
        <PopularJobsItem
          item={{
            image: img1,
            job: {
              name: "Framing",
            },
            count: 120,
          }}
        />
      </div>
    </section>
  );
};

export default PopularJobs;

const PopularJobsItem = ({ item }: { item: any }) => {
  return (
    <div className="w-full h-[379px] column gap-4 bg-mygray-50 rounded-b-xl">
      <div className="w-full h-[250px] relative">
        <Image
          src={item?.image}
          alt="job images"
          fill
          className="object-cover object-center z-0"
        />
      </div>

      <div className="column gap-2 items-center justify-center ">
        <Header header={item?.job?.name} variant="h3" shade="dark" />
        <p className="message-text">Over {item?.count} contractors</p>
      </div>
    </div>
  );
};
