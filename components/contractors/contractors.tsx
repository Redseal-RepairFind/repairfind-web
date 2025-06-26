"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ContractorProfile } from "./contractor-item";
import FilterSkills from "../home/skills-select";
import PlacesAutocomplete, {
  PredictionsType,
} from "../home/places-autocomplete";
import DistanceSlider from "../ui/distance-select";
import { sortBy } from "@/lib/constants";
import Image, { StaticImageData } from "next/image";
import Modal from "../ui/customModal";
import { FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";
import BackBtn from "../ui/back-btn";

type SkillsType = {
  skill: PredictionsType | null;
  openModal: boolean;
};

type Predictions = {
  prediction: PredictionsType | null;
  openModal: boolean;
};

const ContractorsList = () => {
  const [selectedSkills, setSelectedSkills] = useState<SkillsType>({
    skill: null,
    openModal: false,
  });

  const [selectedPredictions, setSelectedPredictions] = useState<Predictions>({
    prediction: null,
    openModal: false,
  });

  const [sortProps, setSortProps] = useState<
    | {
        name: string;
        icon: StaticImageData;
        id: number;
      }
    | undefined
  >(undefined);
  const [distance, setDistance] = useState([0, 0]);

  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = useState(false);
  // console.log(distance);

  return (
    <div className="vertical-space pt-4">
      <div className="w-full flex justify-between items-center ">
        <BackBtn name="Back" />
        <button
          className="py-2 px-4 flex gap-2 items-center rounded-md bg-white shadow-md md:hidden cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <BiSort />
          <p>Filter/sort</p>
        </button>
      </div>

      <div className="grid  md:[grid-template-columns:260px_1fr] lg::[grid-template-columns:400px_1fr] gap-5 mt-5 ">
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="max-h-[400px] column gap-4 overflow-y-auto">
            <FilterBy
              selectedPredictions={selectedPredictions}
              selectedSkills={selectedSkills}
              setDistance={setDistance}
              setSelectedPredictions={setSelectedPredictions}
              setSelectedSkills={setSelectedSkills}
              setToggle={setToggle}
              toggle={toggle}
            />
            <SortBy selected={sortProps} onSelect={setSortProps} />

            <div className="flex flex-col gap-4">
              <button className="btn-secondary">Apply</button>
              <button className="btn-primary">clear</button>
            </div>
          </div>
        </Modal>

        <div className="white-bg-0 w-full max-h-[750px] hidden gap-6 md:flex md:flex-col">
          <FilterBy
            selectedPredictions={selectedPredictions}
            selectedSkills={selectedSkills}
            setDistance={setDistance}
            setSelectedPredictions={setSelectedPredictions}
            setSelectedSkills={setSelectedSkills}
            setToggle={setToggle}
            toggle={toggle}
          />
          <SortBy selected={sortProps} onSelect={setSortProps} />
          <div className="flex flex-col gap-4">
            <button className="btn-secondary">Apply</button>
            <button className="btn-primary">clear</button>
          </div>
        </div>

        <div className="white-bg-0 w-full">
          <ContractorProfile />
          <ContractorProfile />
          <ContractorProfile />
          <ContractorProfile />
          <ContractorProfile />
          <ContractorProfile />
        </div>
      </div>
    </div>
  );
};

export default ContractorsList;

export const ToggleElement = ({
  isToggled,
  setIsToggled,
  grayBg,
}: {
  isToggled: boolean;
  setIsToggled: Dispatch<SetStateAction<boolean>>;
  grayBg?: boolean;
}) => {
  return (
    <button
      className="relative h-3 w-8 rounded-full cursor-pointer  bg-mygray-200"
      onClick={() => setIsToggled((is) => !is)}
    >
      <div
        className={`w-4 h-4 rounded-full ${
          grayBg ? "bg-mygray-400" : "bg-mygray-0"
        } absolute bottom-[-2px] shadow-md ${isToggled ? "left-0" : "right-0"}`}
      />
    </button>
  );
};

const FilterBy = ({
  setDistance,
  selectedPredictions,
  selectedSkills,
  setSelectedPredictions,
  setSelectedSkills,
  toggle,
  setToggle,
}: {
  distance?: number[];
  setDistance: Dispatch<SetStateAction<number[]>>;
  selectedSkills: SkillsType;
  setSelectedSkills: Dispatch<SetStateAction<SkillsType>>;
  selectedPredictions: Predictions;
  setSelectedPredictions: Dispatch<SetStateAction<Predictions>>;
  toggle: boolean;
  setToggle: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="column gap-4">
      <div className="column gap-2">
        <p className="text-sm mb-4">Distance in KM</p>
        <DistanceSlider
          min={0}
          max={100}
          step={1}
          onChange={(range) => setDistance(range)}
        />
      </div>
      <div className="column gap-2">
        <p className="text-sm ">Job category</p>
        <FilterSkills
          selectedSkill={selectedSkills as any}
          setSelectedSkill={setSelectedSkills as any}
        />
      </div>
      <div className="column gap-2">
        <p className="text-sm ">Job location</p>
        <PlacesAutocomplete
          selectedPredictions={selectedPredictions as any}
          setSelectedPredictions={setSelectedPredictions as any}
        />
      </div>
      <div className="column gap-2">
        <p className="text-sm ">Available for emergency jobs</p>
        <ToggleElement isToggled={toggle} setIsToggled={setToggle} />
      </div>
    </div>
  );
};

const SortBy = ({
  selected,
  onSelect,
}: {
  selected:
    | {
        name: string;
        icon: StaticImageData;
        id: number;
      }
    | undefined;
  onSelect: (sort: { name: string; icon: StaticImageData; id: number }) => void;
}) => {
  return (
    <div className="column gap-3">
      <h2 className="font-[500] text-lg">Sort by:</h2>

      {sortBy?.map((sort) => (
        <button
          className="flex items-center gap-3 py-2 border-b last:border-b-0 border-b-mygray-200 cursor-pointer"
          key={sort.id}
          onClick={() => onSelect(sort)}
        >
          <div
            className={`h-4 w-4 rounded-full border border-mygray-300 flex justify-center items-center`}
          >
            <div
              className={`${
                selected?.id === sort.id
                  ? "bg-black h-2.5 w-2.5 rounded-full"
                  : ""
              }`}
            />
          </div>
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 relative">
              <Image
                src={sort.icon}
                alt="Sort icon"
                fill
                className="object-contain"
              />
            </div>
            <p
              className={`${
                selected?.id === sort.id ? "text-myblack-0" : "text-mygray-300"
              }`}
            >
              {sort.name}
            </p>
          </span>
        </button>
      ))}
    </div>
  );
};
