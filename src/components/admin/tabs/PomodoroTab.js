import React from "react";
import PomodoroTimer from "@/components/admin/PomodoroTimer"; // Import the timer component

const PomodoroTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Pomodoro Productivity
      </h2>
      {/* Render the Pomodoro Timer */}
      <PomodoroTimer />

      {/* Placeholder for future features based on the image */}
      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">Pomodoro Activity Heatmap</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">Weekly Pomodoros Bar Chart</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">Sitting vs Standing Time</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">Work Mode Toggle</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">Position/Rank</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">Level/Points</div>
      </div> */}
    </div>
  );
};

export default PomodoroTab;
