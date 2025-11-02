import React, { useState, useEffect } from "react";
import PomodoroTimer from "@/components/admin/PomodoroTimer"; // Import the timer component
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PomodoroTab = () => {
  const [pomodoroData, setPomodoroData] = useState([
    { day: "Mon", count: 3 },
    { day: "Tue", count: 5 },
    { day: "Wed", count: 2 },
    { day: "Thu", count: 4 },
    { day: "Fri", count: 6 },
    { day: "Sat", count: 1 },
    { day: "Sun", count: 0 },
  ]);
  const [workMode, setWorkMode] = useState("sitting");
  const [totalPomodoros, setTotalPomodoros] = useState(21); // Example total for the week

  // Simulate updating pomodoro count (in a real app, this would be from localStorage or an API)
  useEffect(() => {
    // This could be tied to the PomodoroTimer completion event in a real implementation
  }, []);

  const toggleWorkMode = () => {
    setWorkMode(workMode === "sitting" ? "standing" : "sitting");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-slate-900">
        Pomodoro Productivity
      </h2>
      {/* Render the Pomodoro Timer */}
      <PomodoroTimer />

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Weekly Pomodoros Bar Chart */}
        <Card className="bg-white border border-slate-200 text-slate-700 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-heading font-semibold text-slate-900">
              Weekly Pomodoros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pomodoroData}
                  layout="horizontal"
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total this week: {totalPomodoros}
            </p>
          </CardContent>
        </Card>

        {/* Work Mode Toggle */}
        <Card className="bg-white border border-slate-200 text-slate-700 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-heading font-semibold text-slate-900">
              Work Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 capitalize">
                Current: {workMode}
              </span>
              <Button
                onClick={toggleWorkMode}
                variant="outline"
                className="border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Switch to {workMode === "sitting" ? "Standing" : "Sitting"}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Switching between sitting and standing can reduce fatigue.
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for Pomodoro Activity Heatmap */}
        <Card className="bg-white border border-slate-200 text-slate-700 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-heading font-semibold text-slate-900">
              Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <Heatmap />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Heatmap Component
const Heatmap = () => {
  // Sample data: 7 days x 24 hours, value represents Pomodoro count for that hour
  const heatmapData = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 5))
  );

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Function to get color based on value (0-4 Pomodoros)
  const getColor = (value) => {
    if (value === 0) return "bg-muted";
    if (value === 1) return "bg-primary/20";
    if (value === 2) return "bg-primary/40";
    if (value === 3) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Day Labels */}
      <div className="flex h-6 mb-1">
        <div className="w-8" /> {/* Empty corner */}
        {days.map((day) => (
          <div key={day} className="w-8 text-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-row h-full overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {/* Hour Labels */}
        <div className="w-8 flex flex-col justify-between text-right text-xs text-muted-foreground py-2">
          <span>0:00</span>
          <span>6:00</span>
          <span>12:00</span>
          <span>18:00</span>
        </div>

        {/* Heatmap Grid */}
        <div className="flex-1 grid grid-cols-7 gap-1 py-1 pr-1">
          {heatmapData[0].map((_, hour) => (
            <div key={hour} className="flex flex-col gap-1 col-span-1">
              {heatmapData.map((dayData, dayIndex) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className={`h-3 w-full rounded-sm ${getColor(
                    dayData[hour]
                  )} tooltip`}
                  title={`${days[dayIndex]} ${hour}:00 - ${dayData[hour]} Pomodoro(s)`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-2 text-xs text-muted-foreground">
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-muted rounded-sm mr-1"></span> 0
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-primary/20 rounded-sm mr-1"></span> 1
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-primary/40 rounded-sm mr-1"></span> 2
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-primary/60 rounded-sm mr-1"></span> 3
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-primary rounded-sm mr-1"></span> 4+
        </span>
      </div>
    </div>
  );
};

export default PomodoroTab;
