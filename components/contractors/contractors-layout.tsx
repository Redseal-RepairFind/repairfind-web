"use client";

import Image from "next/image";
import { ReactNode } from "react";

const ContractorsClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full column">
      {/* <nav className="h-[108px] w-full bg-mygray-200"></nav> */}
      <nav className="h-[120px] w-full bg-mygray-0 border-b border-b-mygray-200 flex-center gap-2 px-4">
        <Image
          src={"/images/editItem01.png"}
          alt="Edit icon"
          className="md:h-8 md:w-8"
          width={32}
          height={32}
        />
        <p className="input-text">
          Find contractors that fit perfectly into your need
        </p>
      </nav>

      <section className="w-full ">{children}</section>
    </div>
  );
};

export default ContractorsClientLayout;
