"use client";

import { Dispatch, useEffect, useRef, useState } from "react";
import { BiChevronRight, BiSearch } from "react-icons/bi";
import Header from "../ui/header";
import { CgClose } from "react-icons/cg";
import Skills from "@/lib/apis/skills";

const dummySkills = [
  {
    _id: "1",
    name: "Plumber",
  },
  {
    _id: "2",
    name: "Data/security",
  },
  {
    _id: "3",
    name: "Landscaping",
  },
  {
    _id: "4",
    name: "Painting",
  },
  {
    _id: "5",
    name: "Gutter installation",
  },
  {
    _id: "6",
    name: "Irrigation",
  },
  {
    _id: "7",
    name: "Flooring",
  },
  {
    _id: "8",
    name: "Framing",
  },
  {
    _id: "9",
    name: "Insulation",
  },
  {
    _id: "10",
    name: "Milworker",
  },
  {
    _id: "11",
    name: "Plumber",
  },
  {
    _id: "12",
    name: "Data/security",
  },
  {
    _id: "13",
    name: "Landscaping",
  },
  {
    _id: "14",
    name: "Painting",
  },
  {
    _id: "15",
    name: "Gutter installation",
  },
  {
    _id: "16",
    name: "Irrigation",
  },
  {
    _id: "17",
    name: "Flooring",
  },
  {
    _id: "18",
    name: "Framing",
  },
  {
    _id: "19",
    name: "Insulation",
  },
  {
    _id: "110",
    name: "Milworker",
  },
];

const FilterSkills = ({
  selectedSkill,
  setSelectedSkill,
  modal,
}: {
  selectedSkill: {
    skill: { _id: string; name: string } | null;
    openModal: boolean;
  };
  setSelectedSkill: Dispatch<
    React.SetStateAction<{
      skill: { _id: string; name: string } | null;
      openModal: boolean;
    }>
  >;
  modal?: boolean;
}) => {
  const [searchSkill, setSearchSkill] = useState<string>("");
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    async function getSkills() {
      const response = await Skills.getSkills();

      // const data = response.json();

      setSkills(response?.data);
    }

    getSkills();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedSkill((prev) => ({
          ...prev,
          openModal: false,
        }));
      }
    }

    if (selectedSkill.openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedSkill.openModal]);

  return (
    <div className="space-y-2 relative" ref={modal ? containerRef : null}>
      <button
        className="input flex items-center justify-between cursor-pointer"
        onClick={() =>
          setSelectedSkill((prev) => ({
            ...prev,
            openModal: !prev.openModal,
          }))
        }
      >
        <p className="message-text">
          {selectedSkill.skill ? selectedSkill.skill.name : "Select category"}
        </p>

        <BiChevronRight size={24} />
      </button>
      {selectedSkill.openModal ? (
        <div className="border border-mygray-200 shadow-2xl rounded p-2 h-[400px] overflow-y-auto flex flex-col gap-4 absolute left-0 right-0 bg-mygray-100 px-5 py-5 z-50">
          <div className="flex flex-row items-center justify-between mb-5">
            <Header
              header="Categories"
              shade="dark"
              variant="h3"
              className="font-semibold"
            />
            <button
              onClick={() =>
                setSelectedSkill((prev) => ({
                  ...prev,
                  openModal: false,
                }))
              }
            >
              <CgClose size={24} />
            </button>
          </div>
          <div className="bg-mygray-0 focus:outline-none p-2 h-12 flex items-center flex-row gap-4 rounded-full">
            <BiSearch size={24} />
            <input
              type="text"
              placeholder="Search category"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              className=" h-full w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {skills?.map((item) => (
              <button
                className={`${
                  item?.name === selectedSkill.skill?.name
                    ? "bg-myblack-0 text-mygray-0"
                    : "bg-mygray-0"
                } px-4 py-2 rounded-sm text-sm cursor-pointer`}
                key={item?.name}
                onClick={() =>
                  setSelectedSkill({ skill: item, openModal: false })
                }
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FilterSkills;
