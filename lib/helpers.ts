export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`
    );
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

export function reverseGeocodeAddress(
  lat: number,
  lng: number
): Promise<{
  city: string;
  region: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
}> {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const components = results[0].address_components;
        const getComp = (type: string) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const data = {
          city: getComp("locality") || getComp("administrative_area_level_2"),
          region: getComp("administrative_area_level_1"),
          country: getComp("country"),
          address: results[0].formatted_address,
          latitude: lat,
          longitude: lng,
          description: results[0].formatted_address,
        };
        resolve(data);
      } else {
        reject("Reverse geocoding failed");
      }
    });
  });
}

export const getPlaceDetails = (
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    const mapDiv = document.createElement("div");
    const service = new google.maps.places.PlacesService(mapDiv);

    service.getDetails(
      {
        placeId,
        fields: ["address_components", "geometry", "formatted_address", "name"],
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

export function secondsToHours(
  seconds: number,
  decimalPlaces: number = 2
): number {
  const hours = seconds / 3600;
  return parseFloat(hours.toFixed(0));
}

export const getAvailableDatesByWeekdays = (
  weekdays: (
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  )[],
  rangeInDays: number = 90
): Date[] => {
  const weekdayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDays = weekdays.map((day) => weekdayMap[day]);
  const today = new Date();
  const availableDates: Date[] = [];

  for (let i = 0; i < rangeInDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (targetDays.includes(date.getDay())) {
      availableDates.push(date);
    }
  }

  return availableDates;
};
