"use client"; 

import { useState, useEffect } from "react"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; 
import Image from "next/image";
type LapTime = number;

export default function StopWatch() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);


  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

 
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
  };

  const handleLap = () => {
    setLapTimes((prevLapTimes) => [...prevLapTimes, time]);
  };

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);


  return (
    <div 
  className="flex items-center justify-center min-h-screen p-4"
  style={{
    backgroundImage: 'url("/img.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Card className="w-full max-w-lg bg-transparent border border-pink-200 flex flex-col items-center justify-center text-center px-4 sm:px-6">
    <CardHeader className="flex flex-col items-center justify-center text-center">
      <CardTitle className="text-3xl sm:text-5xl font-bold italic">Stopwatch</CardTitle>
      <CardDescription className="text-base sm:text-lg text-slate-900">
        Track your time with this stopwatch.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center gap-6 sm:gap-8 p-4">
      {/* Display the elapsed time */}
      <div className="text-5xl sm:text-8xl font-bold">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </div>
      {/* Buttons to control the stopwatch */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full">
        <Button
          onClick={isRunning ? handleStop : handleStart}
          className="px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium rounded-lg w-28 sm:w-auto"
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button
          onClick={handleReset}
          className="px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium rounded-lg w-28 sm:w-auto"
        >
          Reset
        </Button>
        <Button
          onClick={handleLap}
          className="px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium rounded-lg w-28 sm:w-auto"
        >
          Lap
        </Button>
      </div>
      {/* Display the list of lap times */}
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <CardHeader className="bg-pink-200 text-center">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Lap Times
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Lap</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lapTimes.map((lapTime, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.floor(lapTime / 60000)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor((lapTime % 60000) / 1000)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor((lapTime % 1000) / 10)
                        .toString()
                        .padStart(2, "0")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
</div>

  );
}