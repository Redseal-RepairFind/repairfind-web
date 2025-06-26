// components/PlacesAutocomplete.tsx
"use client";

import { reverseGeocode } from "@/lib/helpers";
import { Dispatch, useEffect, useRef, useState } from "react";
import { BiChevronRight } from "react-icons/bi";

const PlacesAutocomplete = ({
  selectedPredictions,
  setSelectedPredictions,
}: {
  selectedPredictions: {
    prediction: { place_id: string; description: string } | null;
    openModal: boolean;
  };
  setSelectedPredictions: Dispatch<
    React.SetStateAction<{
      prediction: { place_id: string; description: string } | null;
      openModal: boolean;
    }>
  >;
}) => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    { place_id: string; description: string }[]
  >([]);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    if (!autocompleteServiceRef.current && window.google) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    if (input && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions({ input }, (preds) => {
        setPredictions(preds || []);
      });
    } else {
      setPredictions([]);
    }
  }, [input]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setInput(address);
          setSelectedPredictions((prev) => ({
            ...prev,
            prediction: {
              description: address,
              place_id: address.replaceAll(" ", "_"),
            },
          }));
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
  }, [setSelectedPredictions]);

  return (
    <div className="space-y-2 relative">
      <button
        className="input flex items-center justify-between cursor-pointer z-50"
        onClick={() =>
          setSelectedPredictions((prev) => ({
            ...prev,
            openModal: !prev.openModal,
          }))
        }
      >
        <p className="message-text">
          {selectedPredictions.prediction
            ? selectedPredictions.prediction?.description
            : "Enter address"}
        </p>

        <BiChevronRight size={24} />
      </button>
      {selectedPredictions.openModal && (
        <div className="border border-mygray-200 shadow-2xl rounded p-2 max-h-[400px] overflow-y-auto flex flex-col gap-4 absolute left-0 right-0 bg-white z-50">
          <input
            type="text"
            placeholder="Enter address"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2 w-full border border-mygray-400"
          />
          <ul className="">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                className="p-1 cursor-pointer hover:bg-gray-200"
              >
                <button
                  className="w-full h-full text-start text-sm"
                  onClick={() => {
                    setSelectedPredictions({ prediction, openModal: false });
                  }}
                >
                  {prediction.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
