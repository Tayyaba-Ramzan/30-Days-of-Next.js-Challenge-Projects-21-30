"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MailIcon, MapPinIcon, UserIcon, InfoIcon, RefreshCcwIcon, HeartIcon } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

interface User {
  name: string;
  email: string;
  address: string;
  image: string;
  description: string;
}

const RandomUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appreciation, setAppreciation] = useState<boolean>(false);

  const fetchRandomUser = async () => {
    setLoading(true);
    setError(null);
    setUser(null);
    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      const fetchedUser = data.results[0];
      const newUser: User = {
        name: `${fetchedUser.name.first} ${fetchedUser.name.last}`,
        email: fetchedUser.email,
        address: `${fetchedUser.location.street.number} ${fetchedUser.location.street.name}, ${fetchedUser.location.city}, ${fetchedUser.location.country}`,
        image: fetchedUser.picture.large,
        description: fetchedUser.login.uuid,
      };
      setUser(newUser);
    } catch {
      setError("Failed to fetch user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-6 flex-col bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-4xl font-extrabold mb-6 text-slate-800 drop-shadow-lg italic"
      >
        Random User Generator
      </motion.h1>
      <p className="text-gray-600 mb-6 text-center text-lg max-w-xs">
      Fetch a unique user profile instantly—just click below!
      </p>
      <Button 
        onClick={fetchRandomUser} 
        className="mb-6 flex items-center px-6 py-3 text-lg" 
        disabled={loading}
      >
        {loading ? <ClipLoader className="mr-2" size={18} /> : <RefreshCcwIcon className="mr-2" />}
        {loading ? "Fetching..." : "Fetch New User"}
      </Button>
      {error && <div className="text-red-500 text-lg font-bold">{error}</div>}
      {user && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl rounded-xl overflow-hidden max-w-[344px] bg-white relative">
            <CardHeader className="h-40 bg-gradient-to-r from-slate-100 to-orange-600 relative">
              <Image
                src={user.image}
                alt={user.name}
                width={90}
                height={90}
                className="rounded-full border-4 border-white absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 shadow-lg"
              />
            </CardHeader>
            <CardContent className="p-6 pt-16 text-center">
              <h2 className="text-2xl font-bold flex items-center justify-center">
                <UserIcon className="mr-2 text-blue-500" /> {user.name}
              </h2>
              <p className="text-gray-500 flex items-center justify-center mt-2">
                <MailIcon className="mr-2 text-red-500" /> {user.email}
              </p>
              <p className="text-gray-500 flex items-center justify-center mt-2">
                <MapPinIcon className="mr-2 text-green-500" /> {user.address}
              </p>
              <p className="text-gray-500 flex items-center justify-center mt-2">
                <InfoIcon className="mr-2 text-purple-500" /> {user.description}
              </p>
              <div className="flex items-center justify-center">
                <Button 
                  variant="outline" 
                  className="mt-4 flex items-center hover:bg-pink-100" 
                  onClick={() => {
                    setAppreciation(true);
                    setTimeout(() => setAppreciation(false), 2000);
                  }}
                >
                  <HeartIcon className="mr-2 text-pink-500" /> Appreciate
                </Button>
              </div>
              {appreciation && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80"
                >
                  <h2 className="text-3xl font-bold text-black">❤️ Thank you ✨</h2>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default RandomUser;