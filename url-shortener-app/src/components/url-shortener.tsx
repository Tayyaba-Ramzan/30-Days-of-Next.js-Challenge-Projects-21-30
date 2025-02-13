"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";
const BITLY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_BITLY_ACCESS_TOKEN;

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(
        BITLY_API_URL,
        { long_url: longUrl },
        {
          headers: {
            Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShortUrl(response.data.link);
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Successfully Copied the Short URL!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <motion.div
        className="max-w-lg w-full p-6 rounded-2xl  shadow-2xl backdrop-blur-lg border border-white/20 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
            <div className="flex items-center justify-center">
            <Image
            src={"/url-link.png"}
            alt="link"
            width={200}
            height={200}
            />
            </div>
          <h1 className="text-4xl font-bold tracking-wide italic">URL Shortener</h1>
          <p className="text-gray-300 mt-2">
            Paste a long URL and get a short, shareable link instantly.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type="url"
              placeholder="Enter your URL..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="pr-20 bg-gray-900 text-white border border-gray-700 placeholder-gray-500 py-8"
              required
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 px-4 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-semibold"
            >
              Shorten
            </Button>
          </div>

          {error && <p className="text-red-400 text-center">{error}</p>}

          {shortUrl && (
            <motion.div
              className="flex items-center bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Input
                type="text"
                value={shortUrl}
                readOnly
                className="bg-transparent text-white border-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-700 p-2"
                onClick={handleCopy}
              >
                <CopyIcon className="w-5 h-5" />
                <span className="sr-only">Copy</span>
              </Button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
