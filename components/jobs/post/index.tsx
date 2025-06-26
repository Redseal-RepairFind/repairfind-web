"use client";

import FilterSkills from "@/components/home/skills-select";
import Image from "next/image";
import { useState } from "react";

import voiceImg from "@/public/images/mic.png";
import Img from "@/public/images/Image.png";
import PlacesAutocomplete from "@/components/home/places-autocomplete";
import CustomDatePicker from "@/components/ui/date";
import { BiCheck } from "react-icons/bi";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/ui/back-btn";

const PostJobForm = () => {
  const [selectedSkills, setSelectedSkills] = useState<{
    skill: { _id: string; name: string } | null;
    openModal: boolean;
  }>({
    skill: null,
    openModal: false,
  });

  const [selectedPredictions, setSelectedPredictions] = useState<{
    prediction: { place_id: string; description: string } | null;
    openModal: boolean;
  }>({
    prediction: null,
    openModal: false,
  });

  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [isSelected, setIsSelected] = useState(false);

  const router = useRouter();
  return (
    <div
      className="relative w-full min-h-screen  bg-cont bg-start bg-no-repeat"
      style={{ backgroundImage: "url('/images/bgimg.png')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white to-white" />

      {/* Your content here */}
      <div className="relative z-10 column items-center justify-center gap-5 min-h-screen py-8">
        <div className="w-[90%] md:w-[80%] flex justify-start">
          <BackBtn name="Go back" />
        </div>
        <div className="white-bg h-full column gap-5 md:gap-10 text-input">
          <div className="column gap-2">
            <p>Job category</p>
            <FilterSkills
              selectedSkill={selectedSkills}
              setSelectedSkill={setSelectedSkills}
            />
          </div>
          <div className="column gap-2">
            <p>Job description</p>
            <textarea
              placeholder="Enter a detailed description of your job"
              rows={5}
              cols={5}
              className="input w-full p-4"
            />
          </div>

          <div className="column gap-2">
            <p>Provide job location</p>
            <PlacesAutocomplete
              selectedPredictions={selectedPredictions}
              setSelectedPredictions={setSelectedPredictions}
            />
          </div>
          <div className="column gap-2">
            <p>Voice description(optional)</p>
            <button
              className="bg-mygray-100  flex-center relative rounded-full cursor-pointer"
              style={{
                height: 50,
                width: 50,
              }}
            >
              <Image
                src={voiceImg}
                alt="Microphone icon"
                height={20}
                width={20}
              />
            </button>
          </div>

          <div className="column gap-2">
            <p>Date</p>
            <CustomDatePicker
              selected={selected}
              setSelected={setSelected}
              placeholder="Select the date for your job"
            />
          </div>

          <div className="column gap-2">
            <p>
              Upload images/ Videos{" "}
              <span className="message-text">(Highly Recommended)</span>
            </p>
            <button className="bg-mygray-100 h-[200px]  flex-center relative rounded-xl cursor-pointer">
              <div className="column items-center gap-2">
                <p className="message-text">Upload images/videos</p>
                <Image src={Img} alt="Images icon" height={50} width={50} />
              </div>
            </button>
          </div>
          <div className="column gap-3">
            <div
              className="flex items-center gap-2"
              onClick={() => setIsSelected((is) => !is)}
            >
              <button
                className={`h-6 w-6 rounded-md bg-mygray-100 flex items-center justify-center cursor-pointer ${
                  isSelected ? "border" : ""
                }`}
              >
                {isSelected ? <BiCheck /> : null}
              </button>
              <p className={`${isSelected ? "" : "text-mygray-300"}`}>
                I require an onsite evaluation
              </p>
            </div>
            <p className="message-text">
              Disclaimer: Visuals may not fully capture job details, so onsite
              evaluations are recommended by accuracy. Contractors may charge
              $100 site visit fee, which will be credited if estimate is
              accepted. Proceed if you agree by clicking the box. Leave
              unchecked if you decline
            </p>
          </div>
        </div>

        <div className="w-[300px] max-w-[300px]">
          <button
            className="btn-primary w-full"
            onClick={() => router.push("/jobs/personal")}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostJobForm;
