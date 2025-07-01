// components/DatePicker.tsx
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import dayjs from "dayjs";

export default function CustomDatePicker({
  selected,
  setSelected,
  placeholder,
}: {
  unavailableDates?: Date[];
  setSelected?: Dispatch<SetStateAction<Date | undefined>>;
  selected?: Date | undefined;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <button
        className="input flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((op) => !op)}
      >
        <p className="message-text">
          {selected ? dayjs(selected).format("YYYY-MM-DD") : placeholder}
        </p>
        <BiChevronRight size={24} />
      </button>

      {open && (
        <div className="border border-mygray-200 shadow-2xl rounded p-2 max-h-[400px] md:max-w-[400px] overflow-y-auto flex-center gap-4 absolute left-0 right-0 bottom-16 bg-white z-50">
          <Calendar
            selected={selected}
            setSelected={setSelected ?? (() => {})}
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}

export const Calendar = ({
  selected,
  setSelected,
  unavailableDates,
  availableDates,
}: {
  unavailableDates?: Date[];
  setSelected?: Dispatch<SetStateAction<Date | undefined>>;
  selected?: Date | undefined;
  placeholder?: string;
  availableDates?: Date[];
}) => {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      modifiers={{
        unavailable: unavailableDates,
        available: availableDates,
      }}
      className="w-full md:w-[400px]"
      modifiersClassNames={{
        unavailable:
          "line-through rounded-full bg-[#f8f8f8] pointer-events-none ",
        selected: "bg-black text-white rounded-full",
        available: "bg-[#f8f8f8] md:p-2",
      }}
      disabled={{ before: new Date() }}
    />
  );
};
