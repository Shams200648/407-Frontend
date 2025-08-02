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

const chartConfig = {
  power: {
    label: "Power (W)",
    color: "var(--chart-1)",
  },
  current: {
    label: "Current (mA)",
    color: "var(--chart-2)",
  },
  voltage: {
    label: "Voltage (V)",
    color: "var(--chart-3)",
  },
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("1d");
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch data from API
  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await fetch(
        "https://toda-backend-tr28.onrender.com/main-chart/data"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  // Get filtered data based on time range
  const getFilteredData = () => {
    if (!chartData) return [];

    switch (timeRange) {
      case "1d":
        return chartData.today || [];
      case "7d":
        const weekData = chartData.week || [];
        console.log("Last 7 days data:", weekData);
        return weekData;
      case "30d":
        return chartData.month || [];
      default:
        return chartData.week || [];
    }
  };

  const filteredData = getFilteredData();

  // Show loading state
  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Power Consumption Chart</CardTitle>
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

  // Show error state
  if (error) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Power Consumption Chart</CardTitle>
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
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Power Consumption Chart</CardTitle>
          <CardDescription>
            Showing power consumption data for the selected time period
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1d" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-700 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillPower" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-power)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-power)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-current)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-current)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillVoltage" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-voltage)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-voltage)"
                  stopOpacity={0.1}
                />
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
                if (timeRange === "1d") {
                  return `${value}:00`;
                } else {
                  // Handle date string format from API
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }
              }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              domain={[0, 5000]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}V`}
              domain={[200, 260]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (timeRange === "1d") {
                      return `${value}:00`;
                    } else {
                      // Handle date string format from API
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="power"
              type="natural"
              fill="url(#fillPower)"
              stroke="var(--color-power)"
              yAxisId="left"
            />
            <Area
              dataKey="current"
              type="natural"
              fill="url(#fillCurrent)"
              stroke="var(--color-current)"
              yAxisId="left"
            />
            <Area
              dataKey="voltage"
              type="natural"
              fill="url(#fillVoltage)"
              stroke="var(--color-voltage)"
              yAxisId="right"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
