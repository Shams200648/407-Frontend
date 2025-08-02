"use client";

import { ChartAreaInteractive } from "./Main_chart";
import { DeviceControl } from "@/components/DeviceControl";
import React, { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-100 relative">
      <div className="container mx-auto p-6 space-y-6 relative">
        {/* DeviceControl button positioned a bit lower on top right */}
        <div className="absolute top-30 right-6">
          <DeviceControl />
        </div>

        <App />

        <ChartAreaInteractive />
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("wss://four07-backend.onrender.com");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };
    ws.onerror = (err) => console.error("WebSocket error", err);
    ws.onclose = () => console.warn("WebSocket closed");
    return () => ws.close();
  }, []);

  const blinkClass = blink
    ? "opacity-0 transition-opacity duration-150"
    : "opacity-100 transition-opacity duration-150";

  return (
    <div className="font-sans p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Power Consumption Monitoring Dashboard From IoT Device
      </h1>

      {data ? (
        <div className="flex flex-col gap-3 w-60"> {/* ⬅ Compact vertical stack on left */}
          {/* Time */}
          <div className="p-4 rounded-lg shadow border hover:shadow-lg transition duration-200 bg-blue-100 hover:bg-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-1">Time</div>
            <div className={`font-semibold text-blue-900 ${blinkClass}`}>
              {new Date(data.time).toLocaleTimeString()}
            </div>
          </div>

          {/* Current */}
          <div className="p-4 rounded-lg shadow border hover:shadow-lg transition duration-200 bg-green-100 hover:bg-green-200">
            <div className="text-sm font-medium text-gray-700 mb-1">Current</div>
            <div className="font-semibold text-green-900">{data.current} mA</div>
          </div>

          {/* Voltage */}
          <div className="p-4 rounded-lg shadow border hover:shadow-lg transition duration-200 bg-yellow-100 hover:bg-yellow-200">
            <div className="text-sm font-medium text-gray-700 mb-1">Voltage</div>
            <div className="font-semibold text-yellow-900">{data.voltage} V</div>
          </div>

          {/* Power */}
          <div className="p-4 rounded-lg shadow border hover:shadow-lg transition duration-200 bg-red-100 hover:bg-red-200">
            <div className="text-sm font-medium text-gray-700 mb-1">Power</div>
            <div className="font-semibold text-red-900">{data.power} W</div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for data...</p>
      )}
    </div>
  );
}
