"use client";

import { ChartAreaInteractive } from "./Main_chart";
import { DeviceControl } from "@/components/DeviceControl";
import React, { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <App />
        <div className="flex justify-end">
          <DeviceControl />
        </div>
        <ChartAreaInteractive />
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("wss://toda-backend-tr28.onrender.com");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("📡 Data received:", newData);
        setData(newData);
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      } catch (err) {
        console.error("❌ Error parsing message", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed");
    };

    return () => ws.close();
  }, []);

  const blinkClass = blink
    ? "opacity-0 transition-opacity duration-150"
    : "opacity-100 transition-opacity duration-150";

  return (
    <div className="font-sans p-6">
      <h1 className="text-3xl font-bold mb-6"> Live Tuya Device Monitor</h1>

      {data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xl">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Time</div>
            <div className={`font-semibold ${blinkClass}`}>
              {new Date(data.time).toLocaleTimeString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Current</div>
            <div className="font-semibold">{data.current} mA</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Voltage</div>
            <div className="font-semibold">{data.voltage} V</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm font-medium text-gray-500 mb-1">Power</div>
            <div className="font-semibold">{data.power} W</div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for data...</p>
      )}
    </div>
  );
}
