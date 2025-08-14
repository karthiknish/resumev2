import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    if (typeof window !== "undefined" && window.alert) {
      alert(
        isWorkSession
          ? "Work session finished! Time for a break."
          : "Break finished! Time to work."
      );
    }

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
    <Card className="bg-card border border-primary/20 text-foreground max-w-md mx-auto mt-6 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">🍅 Pomodoro Timer</CardTitle>
        <Badge
          variant="secondary"
          className={`text-lg px-3 py-1 ${
            isWorkSession
              ? "bg-brandSecondary/20 text-brandSecondary hover:bg-brandSecondary/30"
              : "bg-primary/20 text-primary hover:bg-primary/30"
          }`}
        >
          {isWorkSession ? "Work Session" : "Break Time"}
        </Badge>
      </CardHeader>
      <CardContent className="text-center">
        <div
          className={`mb-6 p-6 rounded-2xl ${
            isWorkSession
              ? "bg-brandSecondary/10 border border-brandSecondary/20"
              : "bg-primary/10 border border-primary/20"
          }`}
        >
          <p className="text-7xl font-mono font-bold my-4 text-foreground">
            {formatTime(timeLeft)}
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isActive
                ? "bg-brandSecondary hover:bg-brandSecondary/90 text-brandSecondary-foreground"
                : "bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground"
            }`}
          >
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            className="px-8 py-3 rounded-xl font-semibold border-brandSecondary/30 text-brandSecondary hover:bg-brandSecondary/5"
          >
            Reset
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Cycles Completed:{" "}
          <span className="font-bold text-foreground">{cyclesCompleted}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
