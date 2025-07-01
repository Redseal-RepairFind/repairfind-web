"use client";

import { countriesPhoneCodes } from "@/lib/constants";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export type CountryType = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

const CountryList = ({
  country,
  setCountry,
}: {
  country: CountryType;
  setCountry: Dispatch<SetStateAction<CountryType>>;
}) => {
  const [open, setOpen] = useState(false);
  const [countriesToList, setCountriesToList] =
    useState<CountryType[]>(countriesPhoneCodes);
  const [value, setValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[100]" ref={ref}>
      <button
        className="max-w-16 input items-center justify-center flex cursor-pointer text-2xl"
        onClick={() => setOpen((op) => !op)}
      >
        {country.flag}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.05 }}
            className="h-80 w-[90vw] max-w-xs md:w-80 absolute bg-white shadow-lg overflow-y-auto rounded-md border border-gray-200 
top-10 left-1/2 -translate-x-1/2 md:top-10 md:left-auto md:translate-x-0 no-scrollbar"
          >
            <input
              value={value}
              placeholder="Search"
              onChange={(e) => {
                const input = e.target.value;
                setValue(input);

                const filtered = countriesPhoneCodes.filter((cnt) =>
                  cnt.name.toLowerCase().includes(input.toLowerCase())
                );

                setCountriesToList(filtered);

                if (!input) {
                  setCountriesToList(countriesPhoneCodes);
                }
              }}
              className="p-2 border border-mygray-200 w-full rounded-md mt-2 mx-2"
            />

            {countriesToList?.map((cnt) => (
              <button
                key={cnt.code}
                className={`text-sm flex items-center gap-2 px-4 py-2 w-full text-left ${
                  cnt?.name === country.name ? "bg-mygray-200" : ""
                }`}
                onClick={() => {
                  setCountry(cnt);
                  setOpen(false);
                }}
              >
                {cnt?.name === country.name ? <IoCheckmark size={20} /> : null}
                <p className="text-sm ">{cnt.name}</p>

                <p className="">{cnt.flag}</p>

                <p>{cnt.dial_code}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryList;
