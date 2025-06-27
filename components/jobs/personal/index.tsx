"use client";

import BackBtn from "@/components/ui/back-btn";
import Header from "@/components/ui/header";
import { Jobs } from "@/lib/apis/jobs";
import { countriesPhoneCodes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const PersonalDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const submitForm = async (data: any) => {
    try {
      toast.loading("Listing your job...");
      const jobDetails = sessionStorage.getItem("formData");
      const ParsedDetails = JSON.parse(jobDetails as string);

      const { code, phoneNumber, ...rest } = data;
      const dataForm = {
        ...ParsedDetails,
        ...rest,
        phoneNumber: {
          code: data?.code,
          number: data?.phone,
        },
      };

      await Jobs.listJob(dataForm);

      toast.success("Job listed successfully");
      router.replace("/success");
      // console.log(dataForm);
      sessionStorage.removeItem("formData");
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.message);
    } finally {
      toast.remove();
    }
  };
  return (
    <div className="relative z-10 column items-center  gap-5 py-8">
      {/* <div className="w-[90%] md:w-[80%] flex justify-start">
        <BackBtn name="Go back" />
      </div> */}
      <div className="white-bg h-full column gap-5  text-input">
        <Header
          header="Enter your personal details"
          shade="dark"
          variant="h3"
        />
        <div className="column gap-2">
          <p>First name</p>
          <input
            placeholder="Enter your first name"
            className="input"
            {...register("firstName", {
              required: "Enter your first name",
              minLength: {
                value: 3,
                message: "First name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "First name must not exceed 100 characters",
              },
            })}
            type="text"
          />

          {errors?.firstName && (
            <ErrorMsg
              error={errors?.firstName?.message?.toString() as string}
            />
          )}
        </div>

        <div className="column gap-2">
          <p>Last name</p>
          <input
            placeholder="Enter your last name"
            className="input"
            type="text"
            {...register("lastName", {
              required: "Enter your Last name",
              minLength: {
                value: 3,
                message: "Last name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Last name must not exceed 100 characters",
              },
            })}
          />

          {errors?.lastName && (
            <ErrorMsg error={errors?.lastName?.message?.toString() as string} />
          )}
        </div>

        <div className="column gap-2">
          <p>Email</p>
          <input
            placeholder="Enter your email address"
            className="input"
            type="email"
            {...register("email", {
              required: "Enter your email address",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {errors?.email && (
            <ErrorMsg error={errors?.email?.message?.toString() as string} />
          )}
        </div>

        <div className="column gap-2">
          <p>Phone number</p>
          <div className="flex gap-2 items-center">
            <select
              className="bg-mygray-100 py-1 rounded-md max-w-[100px]"
              {...register("code", {
                required: "Select a country code",
              })}
              onChange={(e) => {
                // update the selected option text (code) on selection
                const selected = countriesPhoneCodes.find(
                  (cnt) => cnt.code === e.target.value
                );
                e.target.options[e.target.selectedIndex].text =
                  selected?.code || "";
              }}
            >
              {countriesPhoneCodes.map((cnt, idx) => (
                <option key={idx} value={cnt.code}>
                  {cnt.name} {cnt.code}
                </option>
              ))}
            </select>

            <input
              type="tel"
              placeholder="Enter your phone number"
              className="input"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[0-9]{7,15}$/,
                  message: "Enter a valid phone number",
                },
              })}
            />
          </div>
          {errors?.phone && (
            <ErrorMsg error={errors?.phone?.message?.toString() as string} />
          )}
        </div>
      </div>
      <div className="w-[300px] max-w-[300px]">
        <button
          className="btn-primary w-full"
          onClick={handleSubmit(submitForm)}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;

const ErrorMsg = ({ error }: { error: string }) => {
  return <p className="text-red-600 font-sm">{error}</p>;
};
