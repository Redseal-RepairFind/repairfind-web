"use client";

import { Dispatch, useEffect, useRef, useState } from "react";
import { BiChevronRight } from "react-icons/bi";

export type PredictionsType = {
  city: string;
  region: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
};

const getPlaceDetails = (
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    const mapDiv = document.createElement("div");
    const service = new google.maps.places.PlacesService(mapDiv);

    service.getDetails(
      {
        placeId,
        fields: ["address_components", "formatted_address", "geometry", "name"],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject("Failed to get place details");
        }
      }
    );
  });
};

const PlacesAutocomplete = ({
  selectedPredictions,
  setSelectedPredictions,
  modal,
}: {
  selectedPredictions: {
    prediction: PredictionsType | null;
    openModal: boolean;
  };
  setSelectedPredictions: Dispatch<
    React.SetStateAction<{
      prediction: PredictionsType | null;
      openModal: boolean;
    }>
  >;

  modal?: boolean;
}) => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    { place_id: string; description: string }[]
  >([]);

  console.log(modal);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const containerRef = useRef<any>(null);
  useEffect(() => {
    if (!selectedPredictions.prediction && input === "") {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geocoder = new google.maps.Geocoder();
            const results = await new Promise<google.maps.GeocoderResult[]>(
              (resolve, reject) => {
                geocoder.geocode(
                  { location: { lat: latitude, lng: longitude } },
                  (res, status) => {
                    if (status === "OK" && res) {
                      resolve(res);
                    } else {
                      reject("Failed to reverse geocode location");
                    }
                  }
                );
              }
            );
            const currentAddress = results[0]?.formatted_address;
            if (currentAddress) {
              // console.log(results[0]);
              setInput(currentAddress);
            }
          } catch (err) {
            console.error("Error getting current address:", err);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [selectedPredictions.prediction]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedPredictions((prev) => ({
          ...prev,
          openModal: false,
        }));
      }
    }

    if (selectedPredictions.openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPredictions.openModal]);

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

  return (
    <div className="space-y-2 relative" ref={modal ? containerRef : null}>
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
            ? selectedPredictions.prediction.description
            : "Enter address"}
        </p>
        <BiChevronRight size={24} />
      </button>

      {selectedPredictions.openModal && (
        <div
          className="border border-mygray-200 shadow-2xl rounded p-2 max-h-[400px] overflow-y-auto flex flex-col gap-4 absolute left-0 right-0 bg-white z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="Enter address"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.stopPropagation();
            }}
            className="p-2 w-full border border-mygray-400"
          />
          <ul>
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                className="p-1 cursor-pointer hover:bg-gray-200"
              >
                <button
                  className="w-full h-full text-start  sm:text-sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const details = await getPlaceDetails(
                        prediction.place_id
                      );
                      const components = details.address_components || [];
                      const getComp = (type: string) =>
                        components.find((c) => c.types.includes(type))
                          ?.long_name || "";

                      const fullDetails: PredictionsType = {
                        city:
                          getComp("locality") ||
                          getComp("administrative_area_level_2"),
                        region: getComp("administrative_area_level_1"),
                        country: getComp("country"),
                        address:
                          details.formatted_address || prediction.description,
                        latitude: details.geometry?.location?.lat() || 0,
                        longitude: details.geometry?.location?.lng() || 0,
                        description: prediction.description,
                      };
                      setSelectedPredictions({
                        prediction: fullDetails,
                        openModal: false,
                      });
                      setInput(prediction.description);
                      setPredictions([]);
                    } catch (err) {
                      console.error("Error fetching place details:", err);
                    }
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
