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
      <Card className="shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <CardContent className="p-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg text-white">
              <AiOutlineClockCircle className="mr-2 text-blue-400" />
              <span className="font-mono text-xl flex items-center">
                {hours}
                <span
                  className={`mx-0.5 ${
                    blinking ? "opacity-100" : "opacity-40"
                  } transition-opacity duration-300`}
                >
                  :
                </span>
                {minutes}
                <span
                  className={`mx-0.5 ${
                    blinking ? "opacity-100" : "opacity-40"
                  } transition-opacity duration-300`}
                >
                  :
                </span>
                {seconds}
              </span>
            </div>
            <div className="text-gray-400 mt-1 text-sm">{formattedDate}</div>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}

export default DigitalClock;
