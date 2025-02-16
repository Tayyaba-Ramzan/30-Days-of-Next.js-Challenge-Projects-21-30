"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
} from "lucide-react";
import Image from "next/image";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const defaultTracks: Track[] = [
  {
    title: "Ehd-e-Wafa",
    artist: "Sahir Ali Bagga & Aima Baig",
    src: "/ehde-wafa.mp3", 
  }
];

const AudioPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: 'url("bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-md w-full  shadow-xl rounded-2xl p-6 space-y-6 border border-white/20">
        <div className="flex items-center justify-between text-white">
          <h1 className="text-3xl font-bold italic">Audio Player</h1>
          <label className="flex items-center cursor-pointer">
            <UploadIcon className="w-6 h-6 mr-2" />
            <span>Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="bg-transparent border border-white/30 shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Image
              src="/image.jpg"
              alt="Album Cover"
              width={120}
              height={120}
              className="rounded-full shadow-lg border-4 border-white/40 object-cover"
            />
            <div className="text-center text-white">
              <h2 className="text-xl font-bold">
                {tracks[currentTrackIndex]?.title || "No Track"}
              </h2>
              <p className="text-gray-300">
                {tracks[currentTrackIndex]?.artist || "Sahir Ali Bagga & Aima Baig"}
              </p>
            </div>
            <div className="w-full">
              <Progress value={progress} className="h-2 rounded-full bg-white/30" />
              <div className="flex justify-between text-sm text-gray-300">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevTrack}
                className="text-black bg-white hover:text-yellow-400"
              >
                <RewindIcon className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-black hover:text-green-400 bg-white"
              >
                {isPlaying ? (
                  <PauseIcon className="w-10 h-10" />
                ) : (
                  <PlayIcon className="w-10 h-10" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextTrack}
                className="text-black bg-white hover:text-red-400"
              >
                <ForwardIcon className="w-8 h-8" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioPlayer;
