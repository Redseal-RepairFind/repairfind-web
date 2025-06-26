"use client";

import BackBtn from "@/components/ui/back-btn";
import Header from "@/components/ui/header";

const PersonalDetails = () => {
  return (
    <div className="relative z-10 column items-center  gap-5 py-8">
      <div className="w-[90%] md:w-[80%] flex justify-start">
        <BackBtn name="Go back" />
      </div>
      <div className="white-bg h-full column gap-5  text-input">
        <Header
          header="Enter your personal details"
          shade="dark"
          variant="h3"
        />
        <div className="column gap-2">
          <p>First name</p>
          <input placeholder="Enter your first name" className="input" />
        </div>

        <div className="column gap-2">
          <p>Last name</p>
          <input placeholder="Enter your last name" className="input" />
        </div>

        <div className="column gap-2">
          <p>Email</p>
          <input placeholder="Enter your email address" className="input" />
        </div>

        <div className="column gap-2">
          <p>Phone number</p>
          <input placeholder="Enter your phone number" className="input" />
        </div>
      </div>
      <div className="w-[300px] max-w-[300px]">
        <button className="btn-primary w-full">Proceed</button>
      </div>
    </div>
  );
};

export default PersonalDetails;
