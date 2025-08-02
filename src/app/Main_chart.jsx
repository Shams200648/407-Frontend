"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import { Loader2, RefreshCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated color set
const chartConfig = {
  power: {
    label: "Power (W)",
    color: "#e6194B", // Crimson Red
  },
  current: {
    label: "Current (mA)",
    color: "#3cb44b", // Lime Green
  },
  voltage: {
    label: "Voltage (V)",
    color: "#4363d8", // Royal Blue
  },
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("1d");
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      const response = await fetch("https://four07-backend.onrender.com/main-chart/data");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setChartData(result.data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const getFilteredData = () => {
    if (!chartData) return [];
    switch (timeRange) {
      case "1d":
        return chartData.today || [];
      case "7d":
        return chartData.week || [];
      case "30d":
        return chartData.month || [];
      default:
        return chartData.week || [];
    }
  };

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <Card className="pt-0 bg-gray-100">
        <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Power Consumption Line Chart</CardTitle>
            <CardDescription>Loading power consumption data...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="pt-0 bg-gray-100">
        <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Power Consumption Line Chart</CardTitle>
            <CardDescription>Error loading data</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load data</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0 bg-gray-100">
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Power Consumption Line Chart</CardTitle>
          <CardDescription>
            Visualizing power consumption over time
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="hidden w-[160px] sm:flex">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 flex justify-center items-center"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="chart-container aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e6194B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#e6194B" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3cb44b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3cb44b" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillVoltage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4363d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4363d8" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={timeRange === "1d" ? "hour" : "date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (timeRange === "1d") return `${value}:00`;
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 5000]}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[200, 260]}
              tickFormatter={(value) => `${value}V`}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (timeRange === "1d") return `${value}:00`;
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="power"
              type="natural"
              fill="url(#fillPower)"
              stroke="#e6194B"
              yAxisId="left"
            />
            <Area
              dataKey="current"
              type="natural"
              fill="url(#fillCurrent)"
              stroke="#3cb44b"
              yAxisId="left"
            />
            <Area
              dataKey="voltage"
              type="natural"
              fill="url(#fillVoltage)"
              stroke="#4363d8"
              yAxisId="right"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
