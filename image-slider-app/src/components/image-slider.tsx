"use client"; 

import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import Image from "next/image"; 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; 
import { Button } from "@/components/ui/button"; 
import { PlayIcon, PauseIcon } from "lucide-react"; // Import icons from lucide-react

// Define the ImageData interface
interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export default function ImageSlider() {

  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const interval = 5000; 
  
  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // useEffect to fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to go to the next image
  const nextImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // useEffect to handle the autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(nextImage, interval);
      return () => clearInterval(id);
    }
  }, [isPlaying, nextImage]);

  // Function to toggle play/pause status
  const togglePlayPause = (): void => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  // JSX return statement rendering the Image Slider UI
  return (
    <div 
    className="flex items-center justify-center min-h-screen p-4"
            style={{
               backgroundImage: 'url("https://img.freepik.com/free-photo/geometric-background-with-copy-space_24972-1806.jpg?t=st=1738615911~exp=1738619511~hmac=bd93ba281ca299cc317c31020bb4f6bbc9d290394089b7b4a01df4d29182d69a&w=740")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 italic">Image Slider</h1>
        <p className="text-center text-gray-600 mb-8">
          A simple dynamic image slider/carousel with Unsplash.
        </p>
        <Carousel
          className="rounded-lg overflow-hidden relative"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={image.id}
                className={index === currentIndex ? "block" : "hidden"}
              >
                <Image
                  src={image.urls.regular}
                  alt={image.alt_description}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-white/75 text-center">
                  <h2 className="text-lg font-bold">{image.user.name}</h2>
                  <p className="text-sm">
                    {image.description || image.alt_description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="bg-white/50 hover:bg-white/75 p-2 rounded-full shadow-md transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 text-gray-800" />
              ) : (
                <PlayIcon className="w-6 h-6 text-gray-800" />
              )}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
