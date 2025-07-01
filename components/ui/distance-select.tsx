"use client";

import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

  const handleChange = (val: number | number[]) => {
    if (Array.isArray(val)) {
      setValue([val[0], val[1]]);
      onChange?.([val[0], val[1]]);
    }
  };

  return (
    <div className="w-full max-w-[300px] mx-auto space-y-2">
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        allowCross={false}
        trackStyle={[{ backgroundColor: "#707577" }]}
        handleStyle={[
          { borderColor: "#303446", backgroundColor: "#303446" },
          { borderColor: "#303446", backgroundColor: "#303446" },
        ]}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{value[0]} km</span>
        <span>{value[1]} km</span>
      </div>
    </div>
  );
};

export default DistanceSlider;
