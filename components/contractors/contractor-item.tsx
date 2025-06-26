"use client";

import bgImage from "@/public/images/worker.png";
import shield from "@/public/images/shield-tick.png";
import Image from "next/image";
import Header from "../ui/header";
import { BsStarFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import OtherContractorInfo from "./others";
import { sideBar } from "@/lib/constants";

const ContractorItem = () => {
  return (
    <div className="md:grid  md:[grid-template-columns:260px_1fr] lg::[grid-template-columns:400px_1fr] gap-5 mt-5 vertical-space">
      <div className="white-bg-0 w-full max-h-[500px] hidden gap-6 md:flex md:flex-col pt-6">
        {sideBar?.map((sort) => (
          <button
            className="flex items-center gap-3 py-2 border-b last:border-b-0 border-b-mygray-200 cursor-pointer"
            key={sort.id}
          >
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 relative">
                <Image
                  src={sort.icon}
                  alt="Sort icon"
                  fill
                  className="object-contain"
                />
              </div>
              <p>{sort.name}</p>
            </span>
          </button>
        ))}
      </div>
      <div className="white-bg-0 w-full ">
        <div className="py-4">
          <Header shade="dark" variant="h2" header="Profile" />
        </div>
        <ContractorProfile fullRating />
        <OtherContractorInfo />
      </div>
    </div>
  );
};

export default ContractorItem;

export const ContractorProfile = ({ fullRating }: { fullRating?: boolean }) => {
  const skills = [
    "Farmer",
    "Mech-engineer",
    "Teacher",
    "Fighter",
    "soldier",
    "Army",
    "Farmer",
    "Mech-engineer",
    "Teacher",
    "Fighter",
    "soldier",
    "Army",
  ];

  const router = useRouter();
  return (
    <button
      className="column gap-5 cursor-pointer w-full"
      onClick={() => (fullRating ? {} : router.push(`/contractors/1`))}
    >
      <div className="relative w-full h-[200px] md:h-[400px]">
        <Image
          src={bgImage}
          alt="Contractor Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-space">
        <div className="column gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 relative rounded-full">
              <Image
                src={bgImage}
                alt="Contractor Background"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <Header header="James Madison" shade="dark" variant="h3" />
            <div className="h-4 w-4 relative">
              <Image
                src={shield}
                alt="Contractor Background"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
          {fullRating ? (
            <div className="flex items-center gap-2 flex-wrap w-full  ">
              <RateItem>
                <p className="text-xs">Courteous</p>
                <BsStarFill size={12} />
                <p className="text-xs">5.0</p>
              </RateItem>
              <RateItem>
                <p className="text-xs">Communication</p>
                <BsStarFill size={12} />
                <p className="text-xs">4.0</p>
              </RateItem>
              <RateItem>
                <p className="text-xs">Cleanliness</p>
                <BsStarFill size={12} />
                <p className="text-xs">4.5</p>
              </RateItem>
            </div>
          ) : (
            <div className="flex items-center gap-1 ">
              <p className="text-xs">5.0</p>
              <BsStarFill size={12} />
              <p className="text-xs">(2 rating)</p>
            </div>
          )}
        </div>

        {fullRating ? null : <KmMeasurement message="2km away" />}
      </div>
      <div className="flex items-center gap-2 flex-wrap w-full ">
        {skills.map((skill, i) => (
          <SkillItem skill={skill} key={i} />
        ))}
      </div>

      <div className="grid grid-cols-3 px-2 py-4 border border-mygray-100 rounded-lg ">
        <div className="column justify-center items-center">
          <h3 className="message-text">Response time</h3>
          <h2>1hr</h2>
        </div>
        <div className="column justify-center items-center border-l border-r border-l-mygray-100 border-r-mygray-100">
          <h3 className="message-text">Jobs done</h3>
          <h2>20</h2>
        </div>
        <div className="column justify-center items-center">
          <h3 className="message-text">Jobs cancelled</h3>
          <h2>0</h2>
        </div>
      </div>
    </button>
  );
};

const SkillItem = ({ skill }: { skill: string }) => {
  return (
    <div className="px-3 py-1 bg-mygray-50 rounded-lg flex items-center justify-center">
      <p className="text-mygray-400 text-xs sm:text-sm ">{skill}</p>
    </div>
  );
};

export const RateItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`px-3 py-1 bg-mygray-50 rounded-lg flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </div>
  );
};

export const KmMeasurement = ({ message }: { message: string }) => {
  return (
    <div className="w-[100px]">
      <div className="bg-myYellow py-1 px-2 rounded-lg flex-center ">
        <p className="text-xs">{message}</p>
      </div>
    </div>
  );
};
