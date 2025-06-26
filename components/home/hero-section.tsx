"use client";

import Image from "next/image";

import bgImg from "@/public/images/285e44ac1ef20aed0dfeebd8f61c0adc75be697f.png";
import Header from "../ui/header";
import CustomBtn from "../ui/button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="relative h-[500px] xl:h-[611px] w-full ">
      <Image
        src={bgImg}
        alt="Background image"
        fill
        priority
        className="object-cover object-center z-0"
      />
      <div className="absolute inset-0 bg-bgImg z-10" />
      <div className="relative  flex items-center justify-center z-50 h-full">
        <div className="flex flex-col items-center justify-center gap-5  max-w-[758px] ">
          <Header header=" Post a job, get bids, compare offers, and choose the best one" />

          <CustomBtn onClick={() => router.push("/jobs/post")}>
            Post a job
          </CustomBtn>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
