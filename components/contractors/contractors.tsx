"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

import emptyVid from "@/public/images/no-cont.gif";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { reverseGeocodeAddress } from "@/lib/helpers";
import { ContractorsType } from "@/lib/apis/contractor";
import { useContractors } from "@/lib/hooks/useContractors";
import LoadingTemplate from "../ui/spinner";

type SkillsType = {
  skill: any | null;
  openModal: boolean;
};

type Predictions = {
  prediction: PredictionsType | null;
  openModal: boolean;
};

const ContractorsList = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const category = searchParams?.get("category") || undefined;
  const minResponseTime = searchParams?.get("minResponseTime")
    ? Number(searchParams.get("minResponseTime"))
    : undefined;
  const maxDistance = searchParams?.get("maxDistance")
    ? Number(searchParams.get("maxDistance"))
    : undefined;

  const address = searchParams?.get("address") || undefined;
  const latitude = searchParams?.get("latitude")
    ? Number(searchParams.get("latitude"))
    : undefined;
  const longitude = searchParams?.get("longitude")
    ? Number(searchParams.get("longitude"))
    : undefined;
  const maxResponseTime = searchParams?.get("maxResponseTime")
    ? Number(searchParams.get("maxResponseTime"))
    : undefined;

  const minDistance = searchParams?.get("minDistance")
    ? Number(searchParams.get("minDistance"))
    : undefined;
  const experienceYear = searchParams?.get("experienceYear")
    ? Number(searchParams.get("experienceYear"))
    : undefined;

  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const limit = searchParams?.get("limit")
    ? Number(searchParams.get("limit"))
    : 20;

  const sort = searchParams?.get("sort") as "rating" | "-rating" | undefined;
  const searchName = searchParams?.get("searchName") || undefined;
  const country = searchParams?.get("country") || undefined;
  const city = searchParams?.get("city") || undefined;

  const availableDays = searchParams?.get("availableDays") as
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
    | undefined;

  const isOffDuty =
    searchParams?.get("isOffDuty") === "true"
      ? true
      : searchParams?.get("isOffDuty") === "false"
      ? false
      : undefined;

  const date = searchParams?.get("date") || undefined;
  const accountType = searchParams?.get("accountType") || undefined;
  const emergencyJobs =
    searchParams?.get("emergencyJobs") === "true"
      ? true
      : searchParams?.get("emergencyJobs") === "false"
      ? false
      : undefined;
  const listing = searchParams?.get("listing") || undefined;

  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    console.log(lat, lng);

    if (lat && lng)
      reverseGeocodeAddress(lat, lng)
        .then((location) => {
          if (location) {
            setSelectedPredictions((prev) => ({
              ...prev,
              prediction: location,
            }));
          }
        })
        .catch(console.error);
  }, [latitude, longitude]);

  const [selectedSkills, setSelectedSkills] = useState<SkillsType>({
    skill: category
      ? {
          _id: "jdjd",
          name: category,
        }
      : null,
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
        value: string;
      }
    | undefined
  >(undefined);
  const [distance, setDistance] = useState([
    Number(minDistance),
    Number(maxDistance),
  ]);
  const [toggle, setToggle] = useState(emergencyJobs);
  const [open, setOpen] = useState(false);

  const { contractorsData, isLoadingContravtors } = useContractors();

  const data = contractorsData?.data?.data;

  // console.log(contractors);

  const handleReset = () => {
    setDistance([0, 0]);
    setSelectedPredictions({
      openModal: false,
      prediction: null,
    });
    setToggle(undefined);

    setSelectedSkills({
      openModal: false,
      skill: null,
    });

    setSortProps(undefined);

    if (open) {
      setOpen(false);
    }
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    // Add filters to query
    if (selectedSkills.skill) params.set("category", selectedSkills.skill.name);
    if (selectedPredictions.prediction) {
      params.set(
        "latitude",
        selectedPredictions.prediction.latitude.toString()
      );
      params.set(
        "longitude",
        selectedPredictions.prediction.longitude.toString()
      );
    }

    if (distance[0]) params.set("minDistance", distance[0].toString());
    if (distance[1]) params.set("maxDistance", distance[1].toString());

    if (toggle) params.set("emergencyJobs", "true");
    if (sortProps) params.set("sort", sortProps.value);

    // Always keep pagination reasonable
    params.set("limit", "20");
    params.set("page", "1");

    // Update the URL — this triggers the useEffect that refetches
    router.push(`${pathname}?${params.toString()}`);

    if (open) {
      setOpen(false);
    }
  };

  if (isLoadingContravtors)
    return (
      // <div className="w-full h-screen relative">
      <LoadingTemplate />
      // {/* </div> */}
    );

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
          <div className="max-h-[400px] column gap-4 overflow-y-auto no-scrollbar">
            <FilterBy
              selectedPredictions={selectedPredictions}
              selectedSkills={selectedSkills}
              setDistance={setDistance}
              setSelectedPredictions={setSelectedPredictions}
              setSelectedSkills={setSelectedSkills}
              setToggle={setToggle}
              toggle={toggle}
              modal
            />
            <SortBy selected={sortProps} onSelect={setSortProps} />

            <div className="flex flex-col gap-4">
              <button className="btn-secondary" onClick={handleFilter}>
                Apply
              </button>

              <button className="btn-primary" onClick={handleReset}>
                clear
              </button>
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
            <button className="btn-secondary" onClick={handleFilter}>
              Apply
            </button>

            <button className="btn-primary" onClick={handleReset}>
              clear
            </button>
          </div>
        </div>

        <div className="white-bg-0 w-full">
          {data?.length > 0 ? (
            data?.map((cont: any) => (
              <ContractorProfile data={cont} key={cont?._id} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2  h-full">
              {/* <video width="600" autoPlay muted loop>
                <source src={"/images/no-cont.gif"} type="video/mp4" />
              </video> */}

              <div className="w-[300px] h-[300px] relative">
                <Image
                  src="/images/no-cont.gif"
                  alt="No contractors"
                  className=""
                  fill
                />
              </div>
              <h2 className="font-bold">
                No contractors matches your search description
              </h2>
            </div>
          )}
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
  isToggled: boolean | undefined;
  setIsToggled: Dispatch<SetStateAction<boolean | undefined>>;
  grayBg?: boolean;
}) => {
  // console.log(isToggled);
  return (
    <button
      className="relative h-3 w-8 rounded-full cursor-pointer  bg-mygray-200"
      onClick={() => setIsToggled((is) => !is)}
    >
      <div
        className={`w-4 h-4 rounded-full ${
          grayBg ? "bg-mygray-400" : "bg-mygray-0"
        } absolute bottom-[-2px] shadow-md ${isToggled ? "right-0" : "left-0"}`}
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
  modal,
}: {
  distance?: number[];
  setDistance: Dispatch<SetStateAction<number[]>>;
  selectedSkills: SkillsType;
  setSelectedSkills: Dispatch<SetStateAction<SkillsType>>;
  selectedPredictions: Predictions;
  setSelectedPredictions: Dispatch<SetStateAction<Predictions>>;
  toggle: boolean | undefined;
  setToggle: Dispatch<SetStateAction<boolean | undefined>>;
  modal?: boolean;
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
          modal={modal as boolean}
        />
      </div>
      <div className="column gap-2">
        <p className="text-sm ">Job location</p>
        <PlacesAutocomplete
          selectedPredictions={selectedPredictions as any}
          setSelectedPredictions={setSelectedPredictions as any}
          modal={modal}
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
        value: string;
      }
    | undefined;
  onSelect: (sort: {
    name: string;
    icon: StaticImageData;
    id: number;
    value: string;
  }) => void;
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
