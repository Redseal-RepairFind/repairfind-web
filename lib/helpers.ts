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
