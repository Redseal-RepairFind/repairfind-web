"use client";

import FilterSkills from "@/components/home/skills-select";
import Image from "next/image";
import { useRef, useState } from "react";

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

type FileUploadType = {
  filename: string;
  key: string;
  url: string;
  publicUrl: string;
  fileType: string; // ✅ this is now added properly
};

const PostJobForm = () => {
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

  // console.log(file);

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
    toast.loading("Uploading audio...");

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
      toast.error("Kindly Select a job category");
      return;
    }
    if (!selectedPredictions.prediction) {
      toast.error("Kindly select your job's location");
      return;
    }
    if (!file?.files?.length) {
      toast.error("Kindly upload your jobs Image");

      return;
    }
    try {
      if (audioUrl) {
        const url = await uploadAudio();

        setPublicUrl(url as string);
      }

      const { description, ...rest } = selectedPredictions.prediction;

      const locData = {
        ...rest,
        description: data?.unit || description,
      };
      // console.log(locData);
      const formData = {
        ...data,
        category: selectedSkills.skill?.name,
        location: locData,
        ...(publicUrl && {
          voiceDescription: {
            url: publicUrl,
          },
        }),
        media: file.files && file?.files.map((fil) => fil.publicUrl),
      };

      sessionStorage.setItem("formData", JSON.stringify(formData));
      router.push("/jobs/personal");
      // console.log(formData);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(file.files);

  const router = useRouter();
  return (
    <div
      className="relative w-full min-h-screen  bg-cont bg-start bg-no-repeat"
      style={{ backgroundImage: "url('/images/bgimg.png')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white to-white" />

      {/* Your content here */}
      <div className="relative z-10 column items-center justify-center gap-5 min-h-screen py-8">
        {/* <div className="w-[90%] md:w-[80%] flex justify-start">
          <BackBtn name="Go back" />
        </div> */}
        <div className="white-bg h-full column gap-5 md:gap-10 text-input">
          <div className="column gap-2">
            <p>Job category</p>
            <FilterSkills
              selectedSkill={selectedSkills as any}
              setSelectedSkill={setSelectedSkills as any}
            />
          </div>

          <div className="column gap-2">
            <p>Job description</p>
            <textarea
              placeholder="Enter a detailed description of your job"
              rows={5}
              cols={5}
              className="input w-full p-4"
              {...register("description", {
                required: "Kindly enter a detailed job description",
              })}
            />

            <p className="text-red-600">
              {errors?.description?.message?.toString() as string}
            </p>
          </div>

          <div className="column gap-2">
            <p>Provide job location</p>
            <PlacesAutocomplete
              selectedPredictions={selectedPredictions}
              setSelectedPredictions={setSelectedPredictions}
            />
          </div>
          <div className="column gap-2">
            <p>Unit number / suite (optional)</p>
            <textarea
              placeholder="Unit number / suite"
              rows={3}
              cols={3}
              className="input w-full p-4"
              {...register("unit")}
            />

            <p className="text-red-600">
              {errors?.description?.message?.toString() as string}
            </p>
          </div>
          <div className="column gap-2">
            <p>Voice description(optional)</p>
            {isRecording && stream ? (
              <div className="gap-2 flex items-center">
                <button
                  className=" rounded-sm bg-black"
                  onClick={stopRecording}
                >
                  <BiStop color="#fff" size={24} />
                </button>
                {/* <AudioVisualizer audioUrl={audioUrl as string} /> */}
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
          </div>

          <div className="column gap-2">
            <p>Date</p>
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
              className="hidden"
            />

            <p>
              Upload images/ Videos{" "}
              <span className="message-text">(Highly Recommended)</span>
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
                <div className="column items-center gap-2">
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
              <button
                className={`h-6 w-6 rounded-md bg-mygray-100 flex items-center justify-center cursor-pointer ${
                  isSelected ? "border" : ""
                }`}
              >
                {isSelected ? <BiCheck /> : null}
              </button>
              <p className={`${isSelected ? "" : "text-mygray-300"}`}>
                I require an onsite evaluation
              </p>
            </div>
            <p className="message-text">
              Disclaimer: Visuals may not fully capture job details, so onsite
              evaluations are recommended by accuracy. Proceed if you agree by
              clicking the box. Leave unchecked if you decline
            </p>
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
    </div>
  );
};

export default PostJobForm;
