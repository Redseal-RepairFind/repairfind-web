"use client";
import { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import WaveSurfer from "wavesurfer.js";

export default function AudioWaveform({ audioUrl }: { audioUrl: string }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#000000",
      progressColor: "#000000",
      barWidth: 3,
      barRadius: 2,
      // responsive: true,
      height: 50,
    });

    wavesurferRef.current.load(audioUrl);

    return () => wavesurferRef.current?.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef} className="w-full" />;
}

export const RecordingBars = () => {
  return (
    <div className="flex gap-[2px] items-end h-[40px]">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] bg-black animate-pulse"
          style={{
            animationDuration: `${0.2 + Math.random() * 0.5}s`,
            animationDelay: `${i * 0.05}s`,
            height: `${Math.random() * 30 + 10}px`,
          }}
        />
      ))}
    </div>
  );
};

export interface Props {
  stream: MediaStream;
}
export const LiveVisualizer = ({ stream }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);
    analyser.fftSize = 256; // finer resolution = more bars
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 300; // wider canvas
    canvas.height = 24;

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 2.5; // thinner bars
      const gap = 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 1.5;
        ctx.fillStyle = "#000"; // or customize
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + gap;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      audioContext.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} className="rounded" />;
};

type Prop = {
  audioUrl: string;
  removeWave: () => void;
};

export const WaveformPlayer = ({ audioUrl, removeWave }: Prop) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#999",
      progressColor: "#000",
      cursorColor: "transparent",
      barWidth: 3,
      barRadius: 3,
      height: 24,
    });

    waveSurferRef.current = ws;
    ws.load(audioUrl);

    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    const onLoadMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", onLoadMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadMetadata);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    waveSurferRef.current?.playPause();
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="bg-black py-1 px-2 items-center justify-center flex rounded-md text-white cursor-pointer"
      >
        <p>▶</p>
      </button>

      <div ref={containerRef} className="w-[300px]" />

      {duration && (
        <span className="text-sm text-gray-600">
          {Math.floor(duration / 60)}:
          {String(Math.floor(duration % 60)).padStart(2, "0")}
        </span>
      )}

      <button
        className="bg-mygray-200 h-6 w-6 flex items-center justify-center rounded-full cursor-pointer"
        onClick={removeWave}
      >
        <CgClose />
      </button>
    </div>
  );
};
