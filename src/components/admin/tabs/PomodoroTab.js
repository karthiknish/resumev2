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
    <div>
      <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        🍅 Pomodoro Productivity
      </h2>
      {/* Render the Pomodoro Timer */}
      <PomodoroTimer />

      {/* Additional Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weekly Pomodoros Bar Chart */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-2 border-red-200">
          <h3 className="text-lg font-bold text-red-700 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            📊 Weekly Pomodoros
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pomodoroData}
                layout="horizontal"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "none",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Total this week: {totalPomodoros}
          </p>
        </div>

        {/* Work Mode Toggle */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-2">Work Mode</h3>
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-300 capitalize">
              Current: {workMode}
            </span>
            <Button
              onClick={toggleWorkMode}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Switch to {workMode === "sitting" ? "Standing" : "Sitting"}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Switching between sitting and standing can reduce fatigue.
          </p>
        </div>

        {/* Placeholder for Pomodoro Activity Heatmap */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-2">
            Activity Heatmap
          </h3>
          <div className="h-48">
            <Heatmap />
          </div>
        </div>
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
    if (value === 0) return "bg-gray-700";
    if (value === 1) return "bg-blue-500/30";
    if (value === 2) return "bg-blue-500/50";
    if (value === 3) return "bg-blue-500/70";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Day Labels */}
      <div className="flex h-6 mb-1">
        <div className="w-8" /> {/* Empty corner */}
        {days.map((day) => (
          <div key={day} className="w-8 text-center text-xs text-gray-300">
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-row h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Hour Labels */}
        <div className="w-8 flex flex-col justify-between text-right text-xs text-gray-300 py-2">
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
      <div className="flex justify-center mt-2 text-xs text-gray-400">
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-gray-700 rounded-sm mr-1"></span> 0
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-blue-500/30 rounded-sm mr-1"></span> 1
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-blue-500/50 rounded-sm mr-1"></span> 2
        </span>
        <span className="flex items-center mr-2">
          <span className="w-3 h-3 bg-blue-500/70 rounded-sm mr-1"></span> 3
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></span> 4+
        </span>
      </div>
    </div>
  );
};

export default PomodoroTab;
