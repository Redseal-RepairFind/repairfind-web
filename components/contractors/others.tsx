"use client";

import { dummyImgs, dummyReviews, icons } from "@/lib/constants";
import Image from "next/image";
import Header from "../ui/header";
import { ToggleElement } from "./contractors";
import { useState } from "react";
import { KmMeasurement, RateItem } from "./contractor-item";
import { Calendar } from "../ui/date";
import { BsStarFill } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";

const availableDates = [
  new Date("2025-06-24"),
  new Date("2025-06-25"),
  new Date("2025-06-26"),
  new Date("2025-06-27"),
  new Date("2025-06-28"),
  new Date("2025-06-29"),
  new Date("2025-06-30"),
];

const OtherContractorInfo = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div className="column gap-6">
      <div className="py-5 border-t border-t-mygray-100 border-b border-b-mygray-100 flex items-center gap-12">
        <div className="gap-2 flex items-center">
          <div className="h-5 w-5 relative">
            <Image
              src={icons.experienceIcon}
              alt="Years of experience icon"
              fill
            />
          </div>
          <Header variant="h3" shade="dark" header="Years of experience" />
        </div>

        <p>7</p>
      </div>
      <div className="py-5   flex items-center justify-between">
        <div className="gap-2 flex items-center">
          <div className="h-5 w-5 relative">
            <Image
              src={icons.emergencyIcon}
              alt="Years of experience icon"
              fill
            />
          </div>
          <Header
            variant="h3"
            shade="dark"
            header="Available for emergency jobs"
          />
        </div>

        <ToggleElement isToggled={toggle} setIsToggled={setToggle} grayBg />
      </div>
      <div className="px-5 md:px-6 xl:px-8">
        <RateItem className="w-full justify-start">
          <div className="column gap-2 py-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 relative">
                <Image
                  src={icons.discIcon}
                  alt="Years of experience icon"
                  fill
                />
              </div>
              <Header variant="h3" shade="dark" header="About" />
            </div>
            <p className="message-text">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque,
              maiores. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Fugiat, molestiae.
            </p>
          </div>
        </RateItem>
      </div>
      <div className="py-5 flex items-center justify-between">
        <div className="gap-2 flex items-center">
          <div className="h-5 w-5 relative">
            <Image
              src={icons.experienceIcon}
              alt="Years of experience icon"
              fill
            />
          </div>
          <p className="message-text">London Uk</p>
        </div>

        <KmMeasurement message="2km away" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-5 w-5 relative">
          <Image src={icons.calendarIcon} alt="Years of experience icon" fill />
        </div>
        <Header variant="h3" shade="dark" header="Available days" />
      </div>

      <div className="px-4 md:px-7">
        <Calendar availableDates={availableDates} />
      </div>
      <div className="flex justify-start">
        <Header variant="h1" shade="dark" header="Media" />
      </div>

      <div className="column gap-4">
        <Header variant="h3" shade="dark" header="Photos" />
        <div className="grid-3-img">
          {dummyImgs.map((img, i) => (
            <div
              className="relative w-full h-[120px] md:h-[120px] rounded-md"
              key={i}
            >
              <Image
                src={img}
                alt="Contractor Background"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          ))}
        </div>
        <Header variant="h3" shade="dark" header="Videos" />

        <div className="overflow-flex gap-4 w-full  no-scrollba">
          {dummyImgs.map((img, i) => (
            <div
              className="relative h-[120px] w-[250px] flex-shrink-0 rounded-md"
              key={i}
            >
              <Image
                src={img}
                alt="Contractor Background"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-start">
        <Header variant="h1" shade="dark" header="Review" />
      </div>

      <div className="overflow-flex gap-4 w-full  no-scrollbar">
        {dummyReviews.map((review) => (
          <RateItem
            className="relative   max-w-[300px] flex-shrink-0"
            key={review.id}
          >
            <div className="column gap-2 py-2">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 relative rounded-full">
                    <Image
                      src={review.img}
                      alt="Contractor Background"
                      fill
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
                  <p className="text-black text-sm">{review.name}</p>
                </div>
                <div className="flex items-center gap-1 ">
                  <BsStarFill size={12} />
                  <p className="text-xs">{review.rating}</p>
                </div>
              </div>

              <p className="message-text">{review.review}</p>
            </div>
          </RateItem>
        ))}
      </div>

      <div className="flex-space gap-5 mt-6">
        <button className="btn-secondary w-full">Make Request</button>
        <button className="btn-primary justify-center flex items-center gap-2 w-full">
          <BiSolidLeftArrow />
          <p>Back</p>
        </button>
      </div>
    </div>
  );
};

export default OtherContractorInfo;
