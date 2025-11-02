import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Card, CardContent } from "@/components/ui/card";
import { ScaleIn } from "@/components/animations/MotionComponents";

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setBlinking((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = format(time, "EEE, MMM d, yyyy");

  // Format time parts separately to add blinking colon
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <ScaleIn>
      <Card className="rounded-xl border border-slate-200 bg-white shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center rounded-lg border border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 shadow">
              <AiOutlineClockCircle className="mr-2.5 text-white text-lg" />
              <span className="flex items-center font-mono text-xl font-bold text-white">
                {hours}
                <span
                  className={`mx-1 ${
                    blinking ? "opacity-100" : "opacity-40"
                  } transition-opacity duration-300`}
                >
                  :
                </span>
                {minutes}
                <span
                  className={`mx-1 ${
                    blinking ? "opacity-100" : "opacity-40"
                  } transition-opacity duration-300`}
                >
                  :
                </span>
                {seconds}
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formattedDate}
            </div>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}

export default DigitalClock;
