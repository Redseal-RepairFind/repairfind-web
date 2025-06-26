"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const JobsClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="w-full column">
      <nav className="h-[108px] w-full bg-mygray-200"></nav>
      <nav className="h-[120px] w-full bg-mygray-0 border-b border-b-mygray-200 flex-center gap-2 px-4">
        <Image
          src={"/images/editItem01.png"}
          alt="Edit icon"
          className="md:h-8 md:w-8"
          width={32}
          height={32}
        />
        <p className="input-text">
          {pathname.includes("post")
            ? "Please include as much information as can to help us connect you to the best contractor for your job posting"
            : "To allow you get a feedback from contractors that will be sending bids, we need to have your personal Information"}
        </p>
      </nav>

      <section className="w-full ">{children}</section>
    </div>
  );
};

export default JobsClientLayout;
