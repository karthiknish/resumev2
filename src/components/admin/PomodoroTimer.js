import React, { useState, useEffect, useCallback } from "react";

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsWorkSession(true);
    setTimeLeft(WORK_DURATION);
    setCyclesCompleted(0);
  }, []);

  const handleSessionEnd = useCallback(() => {
    setIsActive(false);
    // Play a sound or show notification (optional)
    alert(
      isWorkSession
        ? "Work session finished! Time for a break."
        : "Break finished! Time to work."
    );

    if (isWorkSession) {
      setCyclesCompleted((prev) => prev + 1);
      setTimeLeft(BREAK_DURATION);
    } else {
      setTimeLeft(WORK_DURATION);
    }
    setIsWorkSession(!isWorkSession);
  }, [isWorkSession]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleSessionEnd();
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on unmount or state change
  }, [isActive, timeLeft, handleSessionEnd]);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Pomodoro Timer</h2>
      <div
        className={`mb-4 p-4 rounded-md ${
          isWorkSession ? "bg-blue-600" : "bg-green-600"
        }`}
      >
        <p className="text-lg font-semibold">
          {isWorkSession ? "Work Session" : "Break Time"}
        </p>
        <p className="text-6xl font-mono font-bold my-4">
          {formatTime(timeLeft)}
        </p>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded font-semibold text-white transition-colors duration-200 ${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-gray-400">
        Cycles Completed: {cyclesCompleted}
      </p>
    </div>
  );
};

export default PomodoroTimer;
