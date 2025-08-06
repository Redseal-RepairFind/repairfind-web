"use client";

import FilterSkills from "@/components/home/skills-select";
import Image from "next/image";
import { ReactNode, useRef, useState } from "react";

import voiceImg from "@/public/images/mic.png";
import Img from "@/public/images/Image.png";
import PlacesAutocomplete, {
  PredictionsType,
} from "@/components/home/places-autocomplete";
import CustomDatePicker from "@/components/ui/date";
import { BiCheck, BiStop } from "react-icons/bi";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/ui/back-btn";
import axios from "axios";
import { deleteFromS3, getSignUrls } from "@/lib/aws/aws-action";
import toast from "react-hot-toast";
import LoadingTemplate from "@/components/ui/spinner";
import { TbTrashFilled } from "react-icons/tb";
import { PiPlus } from "react-icons/pi";
import AudioVisualizer, {
  LiveVisualizer,
  WaveformPlayer,
} from "@/components/ui/audio-visualizer";
import { useForm } from "react-hook-form";
import { countriesPhoneCodes } from "@/lib/constants";
import { Jobs } from "@/lib/apis/jobs";
import CountryList, { CountryType } from "@/components/ui/countries";
import { ErrorMsg } from "@/components/jobs/personal";
import dayjs from "dayjs";

type FileUploadType = {
  filename: string;
  key: string;
  url: string;
  publicUrl: string;
  fileType: string; // ✅ this is now added properly
};

const PostForm = () => {
  const [selectedPredictions, setSelectedPredictions] = useState<{
    prediction: PredictionsType | null;
    openModal: boolean;
  }>({
    prediction: null,
    openModal: false,
  });
  const [selectedSkills, setSelectedSkills] = useState<{
    skill: { name: string } | null;
    openModal: boolean;
  }>({
    skill: null,
    openModal: false,
  });

  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [isSelected, setIsSelected] = useState(false);
  const [country, setCountry] = useState<CountryType>({
    name: "Canada",
    flag: "🇨🇦",
    code: "CA",
    dial_code: "+1",
  });
  const [file, setFile] = useState<{
    loading: boolean;
    files: FileUploadType[] | null;
  }>({
    loading: false,
    files: null,
  });
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<any | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm();

  // console.log();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length === 0) {
      toast.error("Only image or video files are allowed");
      return;
    }

    const filesDetail = validFiles.map((file) => ({
      filename: file.name,
      fileType: file.type,
    }));

    setFile((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      toast.loading("Uploading files...");

      const uploadedFiles = await getSignUrls(filesDetail);

      if (!uploadedFiles.success || !uploadedFiles.urls) {
        throw new Error(
          uploadedFiles.error || "Could not generate signed URLs"
        );
      }

      // Upload to signed URLs
      await Promise.all(
        validFiles.map((file, i) =>
          axios.put(uploadedFiles.urls![i].url, file, {
            headers: {
              "Content-Type": file.type,
            },
          })
        )
      );

      // Merge file metadata with uploaded file URL
      const uploadedWithType = uploadedFiles.urls.map((urlObj, index) => ({
        ...urlObj,
        fileType: validFiles[index].type,
      }));

      setFile((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...uploadedWithType],
      }));

      toast.remove();
      toast.success("Files uploaded successfully");
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.message || "File upload failed");
    } finally {
      setFile((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleDeleteImg = async (key: string) => {
    try {
      setFile((prev) => {
        const filteredFiles =
          prev.files?.filter((file) => file.key !== key) ?? [];

        return {
          ...prev,
          files: filteredFiles.length > 0 ? filteredFiles : null,
        };
      });

      await deleteFromS3(key);
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.message || "File deletion failed");
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    setFile((prev) => ({ ...prev, loading: true }));
    toast.loading("posting...");

    try {
      const filename = `recording-${Date.now()}.webm`;

      const uploadedFiles = await getSignUrls([
        {
          filename,
          fileType: audioBlob.type,
        },
      ]);

      const signedUrlData = uploadedFiles?.urls?.[0];
      if (!signedUrlData) throw new Error("Failed to get signed URL");

      // Upload the blob to S3 using the signed URL
      await axios.put(signedUrlData.url, audioBlob, {
        headers: {
          "Content-Type": audioBlob.type,
        },
      });

      setPublicUrl(signedUrlData.publicUrl);

      toast.remove();
      toast.success("Audio uploaded successfully");

      return signedUrlData.publicUrl;
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.message || "Audio upload failed");
    } finally {
      setFile((prev) => ({
        ...prev,
        loading: false,
      }));
      toast.remove();
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp4" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);

        console.log(url);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
    } catch (error: any) {
      console.error(error);
    } finally {
      setFile((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const stopRecording = () => {
    recorder?.stop();
    recorder?.stream.getTracks().forEach((t) => t.stop());
    // setRecorder(null);
    setIsRecording(false);
  };

  // console.log(audioUrl);

  const submitForm = async (data: any) => {
    if (!data.description) {
      toast.error(errors?.description?.message?.toString() as string);
      return;
    }

    if (!selectedSkills.skill) {
      toast.error("Kindly select a job category");
      return;
    }

    if (!selectedPredictions.prediction) {
      toast.error("Kindly select your job's location");
      return;
    }

    try {
      let uploadedAudioUrl: any | null = null;

      // Upload audio if it exists
      if (audioUrl) {
        // toast.loading("Uploading audio...");
        uploadedAudioUrl = await uploadAudio();
      }

      // Prepare location data
      const pred = selectedPredictions.prediction;
      const { code, phoneNumber, unit, phone, site_visit, ...rest } = data;

      const locData = {
        address: pred.address,
        longitude: pred.longitude,
        latitude: pred.latitude,
        city: pred?.city,
        country: pred.country, // typo? 'coyntry' => 'country'
        region: pred?.region,
        description: unit || pred.description,
      };

      const formData = {
        ...rest,
        phoneNumber: {
          code: country.dial_code,
          number: phone,
        },
        category: selectedSkills.skill?.name,
        location: locData,
        ...(uploadedAudioUrl && {
          voiceDescription: {
            url: uploadedAudioUrl,
          },
        }),
        ...(file.files?.length && {
          media: file.files.map((fil) => fil.publicUrl),
        }),
        date: dayjs(selected?.toISOString()).format("YYYY-MM-DD"),
        requiresSiteVisit: site_visit === "true" ? true : false,
      };

      // console.log(formData);
      toast.loading("Submitting job...");
      await Jobs.listJob(formData);

      // toast.dismiss();
      toast.remove();

      toast.success("Job listed successfully");
      router.replace("/success");
    } catch (error: any) {
      console.error(error);
      // toast.dismiss();
      toast.remove();

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      toast.remove();
    }
  };

  // console.log(file.files);

  const router = useRouter();
  return (
    <div
      className="relative w-full min-h-screen  bg-cont bg-start bg-no-repeat"
      // style={{ backgroundImage: "url('/images/bgimg.png')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white to-white" />

      {/* Your content here */}
      <div className="relative z-10 column items-center justify-center gap-5 min-h-screen">
        {/* <div className="relative z-10 column items-center justify-center gap-5 min-h-screen py-8"> */}
        {/* <div className="w-[90%] md:w-[80%] flex justify-start">
          <BackBtn name="Go back" />
        </div> */}

        {/* <div className="white-bg h-full column gap-5 md:gap-10 text-input text-xs md:text-sm"> */}
        <div className="w-full bg-white p-4 rounded-sm h-full column  gap-6 capitalize label pt-4">
          <GridForm>
            <div className="column gap-2">
              <p>First name</p>
              <input
                placeholder="First name"
                className="input placeholder:font-normal"
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
                placeholder="Last name"
                className="input placeholder:font-normal"
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
                <ErrorMsg
                  error={errors?.lastName?.message?.toString() as string}
                />
              )}
            </div>
          </GridForm>
          <GridForm>
            <div className="column gap-2">
              <p>Email address</p>
              <input
                placeholder="Email address"
                className="input placeholder:font-normal"
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
                <ErrorMsg
                  error={errors?.email?.message?.toString() as string}
                />
              )}
            </div>

            <div className="column gap-2">
              <p>Phone number</p>
              <div className="flex gap-2 items-center">
                {/* <select
                  className="py-2 bg-mygray-100  max-w-[60px]"
                  {...register("code", {
                    required: "Select a country code",
                  })}
                  defaultValue={"+1"}
                  onChange={(e) => {
                    const selected = countriesPhoneCodes.find(
                      (cnt) => cnt.dial_code === e.target.value
                    );

                    // Override visible text in the select box to only show the code
                    e.target.options[e.target.selectedIndex].text =
                      selected?.flag || "";
                  }}
                >
                  {countriesPhoneCodes.map((cnt, idx) => (
                    <option key={idx} value={cnt.dial_code} className="text-lg">
                      {cnt.name} {cnt.flag} {cnt.dial_code}
                    </option>
                  ))}
                </select> */}
                <CountryList setCountry={setCountry} country={country} />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="input placeholder:font-normal"
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
                <ErrorMsg
                  error={errors?.phone?.message?.toString() as string}
                />
              )}
            </div>
          </GridForm>
          <div className="column gap-2">
            <p className="text-xs md:text-sm">
              Type of contractors you need for your project
            </p>
            <FilterSkills
              selectedSkill={selectedSkills as any}
              setSelectedSkill={setSelectedSkills as any}
            />
          </div>

          <div className="column gap-2">
            <p className="text-xs md:text-sm">Tell us what you need fixed</p>
            <textarea
              placeholder="Enter a detailed description of your job"
              rows={5}
              cols={5}
              className="input w-full p-4 placeholder:font-normal"
              {...register("description", {
                required: "Kindly enter a detailed job description",
              })}
            />

            <p className="text-red-600">
              {errors?.description?.message?.toString() as string}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-3">
            <div className="column gap-2">
              <p className="text-xs md:text-sm">Job address</p>
              <PlacesAutocomplete
                selectedPredictions={selectedPredictions}
                setSelectedPredictions={setSelectedPredictions}
                modal
              />
            </div>
            <div className="column gap-2">
              <p className="text-xs md:text-sm">
                Unit number / suite (optional)
              </p>
              <textarea
                placeholder="Unit number / suite"
                rows={1}
                cols={1}
                className="input w-full p-4 placeholder:font-normal"
                {...register("unit")}
              />

              <p className="text-red-600">
                {errors?.description?.message?.toString() as string}
              </p>
            </div>
          </div>
          {/* <div className="column gap-2">
            <p className="text-xs md:text-sm">Voice description(optional)</p>
            {isRecording && stream ? (
              <div className="gap-2 flex items-center">
                <button
                  className=" rounded-sm bg-black"
                  onClick={stopRecording}
                >
                  <BiStop color="#fff" size={24} />
                </button>
                <LiveVisualizer stream={stream} />
              </div>
            ) : audioUrl ? (
              <WaveformPlayer
                audioUrl={publicUrl || audioUrl}
                removeWave={() => {
                  setAudioUrl(null);
                  setStream(null);
                  setIsRecording(false);
                  setAudioBlob(null);
                  setPublicUrl(null);
                }}
              />
            ) : (
              <button
                className="bg-mygray-100  flex-center relative rounded-full cursor-pointer"
                style={{
                  height: 50,
                  width: 50,
                }}
                onClick={startRecording}
              >
                <Image
                  src={voiceImg}
                  alt="Microphone icon"
                  height={20}
                  width={20}
                />
              </button>
            )}
          </div> */}

          <div className="column gap-2">
            <p className="text-xs md:text-sm">
              When are you hoping to get this project completed by
            </p>
            <CustomDatePicker
              selected={selected}
              setSelected={setSelected}
              placeholder="Select the date for your job"
            />
          </div>

          <div className="column gap-2">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden "
            />

            <p className="text-xs md:text-sm">
              Upload images/ Videos{" "}
              <span className="message-text">
                (Optional but Highly Recommended)
              </span>
            </p>
            <div
              className={`bg-mygray-100 h-[200px]  flex-center relative rounded-xl  ${
                (file?.files && file?.files?.length > 0) || file.loading
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } `}
              onClick={(e) => {
                // e.preventDefault();
                (file?.files && file?.files?.length > 0) || file.loading
                  ? {}
                  : fileInputRef.current?.click();
              }}
              // disabled={
              //   (file?.files && file?.files?.length > 0) || file.loading
              // }
            >
              {file.files?.length && (
                <div className="mb-2 absolute top-0 left-4">
                  <button
                    className="bg-mygray-100 px-2 flex items-center gap-2 cursor-pointer shadow-md"
                    onClick={(e) => {
                      // e.preventDefault();
                      e.stopPropagation();
                      fileInputRef.current?.click();

                      console.log("click");
                    }}
                  >
                    <PiPlus />
                    <p>Add</p>
                  </button>
                </div>
              )}
              {file.loading && !file?.files?.length ? (
                <LoadingTemplate isMessage={false} />
              ) : file.files?.length ? (
                <div className="overflow-flex gap-4 w-full mt-4 no-scrollbar">
                  {file.files.map((file, i) => (
                    <div
                      className="relative h-[150px] w-[150px] flex-shrink-0 rounded-md"
                      key={i}
                    >
                      <button
                        className="absolute py-1 px-1 bg-black rounded-md top-4 right-4 z-50 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteImg(file.key);
                        }}
                      >
                        <TbTrashFilled color="#fff" />
                      </button>
                      {file.fileType.startsWith("video/") ? (
                        <video
                          controls
                          className="object-cover rounded-lg"
                          src={file.publicUrl}
                        />
                      ) : (
                        <Image
                          src={file.publicUrl}
                          alt="Upload img"
                          fill
                          className="object-cover rounded-lg"
                          priority
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="column items-center gap-6">
                  <p className="message-text">Upload images/videos</p>
                  <Image src={Img} alt="Images icon" height={50} width={50} />
                </div>
              )}
            </div>
          </div>
          <div className="column gap-3">
            <div
              className="flex items-center gap-2"
              onClick={() => setIsSelected((is) => !is)}
            >
              <p className={``}>
                To provide accurate quote. Do we have permissions to access your
                property?.
              </p>
            </div>
            <select
              id=""
              className="input"
              {...register("site_visit", {
                required: "Kindly select an option",
              })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {/* <p className="message-text">
              Disclaimer: Visuals may not fully capture job details, so onsite
              evaluations are recommended by accuracy. Proceed if you agree by
              clicking the box. Leave unchecked if you decline
            </p> */}
          </div>
          <div className=" w-full flex items-center justify-center">
            <div className="w-64">
              <button
                className="btn-secondary w-full"
                onClick={handleSubmit(submitForm)}
              >
                Request A Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

const GridForm = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
};
