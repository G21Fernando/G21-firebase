import { Clock } from "lucide-react";
import TimekeeperIcon from "./icons/TimekeeperIcon";

interface StatsCardProps {
  practiceTime: number;
  points: number;
}

const StatsCard = ({ practiceTime, points }: StatsCardProps) => {
  const formatTime = (minutes: number) => {
    return minutes;
  };

  return (
    <div className="flex flex-col space-y-2 p-2 md:space-y-4 md:p-6">
      <div className="flex items-start space-x-2 md:space-x-3">
        <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#11245A] mt-1" />
        <div className="flex flex-col">
          <span className="text-base md:text-lg font-medium text-[#11245A]">
            Minutes Mastered Today:
          </span>
          <span className="text-xl md:text-2xl font-semibold text-[#11245A]">
            {formatTime(practiceTime)}
          </span>
        </div>
      </div>
      
      <div className="flex items-start space-x-2 md:space-x-3">
        <TimekeeperIcon className="w-5 h-5 md:w-6 md:h-6 text-[#11245A] mt-1" />
        <div className="flex flex-col">
          <span className="text-base md:text-lg font-medium text-[#11245A]">
            Points:
          </span>
          <span className="text-xl md:text-2xl font-semibold text-[#11245A] mb-0">
            {points}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;