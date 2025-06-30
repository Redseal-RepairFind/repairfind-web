"use client";

import { useState } from "react";
// import { GoogleMapsProvider } from "../ui/google-maps-provider";
import Header from "../ui/header";
import PlacesAutocomplete, { PredictionsType } from "./places-autocomplete";
import FilterSkills from "./skills-select";
import CustomBtn from "../ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FilterSearch = () => {
  const [selectedPredictions, setSelectedPredictions] = useState<{
    prediction: PredictionsType | null;
    openModal: boolean;
  }>({
    prediction: null,
    openModal: false,
  });
  const [selectedSkills, setSelectedSkills] = useState<{
    skill: { _id: string; name: string } | null;
    openModal: boolean;
  }>({
    skill: null,
    openModal: false,
  });

  const router = useRouter();

  console.log(selectedPredictions);

  return (
    <>
      <div className="column gap-4 max-w-4xl">
        <Header
          header="You can also search through our contractors"
          shade="dark"
          variant="h3"
          className="font-bold"
        />

        <FilterSkills
          selectedSkill={selectedSkills as any}
          setSelectedSkill={setSelectedSkills as any}
        />
        <PlacesAutocomplete
          selectedPredictions={selectedPredictions}
          setSelectedPredictions={setSelectedPredictions}
        />
        <div className="w-1/2  lg:w-1/3 xl:w-1/4">
          <CustomBtn
            variant="color"
            className="w-full"
            onClick={() => {
              if (!selectedPredictions.prediction) {
                toast.error("Kindly select an address");
                return;
              }

              router.push(
                `/contractors?latitude=${selectedPredictions?.prediction.latitude}&longitude=${selectedPredictions?.prediction.longitude}&category=${selectedSkills?.skill?.name}`
              );
            }}
          >
            Search
          </CustomBtn>
        </div>
      </div>
    </>
  );
};

export default FilterSearch;
