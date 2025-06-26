"use client";

import React, { useState } from "react";
import ReactSlider from "react-slider";

const DistanceSlider = ({
  min = 0,
  max = 50,
  step = 1,
  onChange,
}: {
  min?: number;
  max?: number;
  step?: number;
  onChange?: (range: number[]) => void;
}) => {
  const [value, setValue] = useState<[number, number]>([min, max]);

  const handleChange = (val: [number, number]) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="thumb shadow-lg"
        trackClassName="track"
        defaultValue={[min, max]}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        ariaLabel={["Lower thumb", "Upper thumb"]}
        pearling
        minDistance={5}
      />
      <div className="flex justify-between text-sm mt-2 text-gray-600">
        <span>{value[0]} km</span>
        <span>{value[1]} km</span>
      </div>
    </div>
  );
};

export default DistanceSlider;
