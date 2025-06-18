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
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl text-white shadow-lg">
              <AiOutlineClockCircle className="mr-3 text-white text-xl" />
              <span className="font-mono text-2xl flex items-center font-bold">
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
            <div className="text-gray-600 mt-2 text-sm font-semibold">{formattedDate}</div>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}

export default DigitalClock;
