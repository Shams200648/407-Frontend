"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeviceControl() {
  const [switchState, setSwitchState] = React.useState(false);
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  // Fetch initial switch status
  React.useEffect(() => {
    const fetchSwitchStatus = async () => {
      try {
        const response = await fetch(
          "https://toda-backend-tr28.onrender.com/switch-status"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setSwitchState(result.data.switch);
          console.log("Current switch status:", result.data.switch);
        } else {
          console.error("Failed to fetch switch status:", result.error);
        }
      } catch (err) {
        console.error("Error fetching switch status:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSwitchStatus();
  }, []);

  const handleSwitchToggle = async (checked) => {
    try {
      setSwitchLoading(true);
      const response = await fetch(
        "https://toda-backend-tr28.onrender.com/switch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: checked }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSwitchState(checked);
        console.log(`Device switched ${checked ? "on" : "off"} successfully`);
      } else {
        throw new Error(result.error || "Failed to control device switch");
      }
    } catch (err) {
      console.error("Error controlling device switch:", err);
      // Revert the switch state on error
      setSwitchState(!checked);
      alert(`Failed to switch device: ${err.message}`);
    } finally {
      setSwitchLoading(false);
    }
  };

  return (
    <Card className="w-64">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Device Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Power Switch
            </span>
            <span className="text-xs text-gray-500">
              {initialLoading
                ? "Loading..."
                : switchState
                ? "Device is ON"
                : "Device is OFF"}
            </span>
          </div>
          <Switch
            checked={switchState}
            onCheckedChange={handleSwitchToggle}
            disabled={switchLoading || initialLoading}
            className="scale-110"
          />
        </div>
      </CardContent>
    </Card>
  );
}
