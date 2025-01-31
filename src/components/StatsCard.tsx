import React from 'react';
import TimekeeperIcon from "./icons/TimekeeperIcon";
import { Clock, Music } from "lucide-react";

interface StatsCardProps {
  points: number;
  practiceTime: number;
  dailyPoints: number;
  dailyPracticeTime: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  points,
  practiceTime,
  dailyPoints,
  dailyPracticeTime,
}) => {
  return (
    <div className="rounded-lg shadow-sm p-2 md:p-6">
      <div className="flex flex-col space-y-2 md:space-y-4">
        <div className="flex items-start space-x-3">
          <TimekeeperIcon className="w-6 h-6 mt-1 text-[#11245A]" />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-medium text-[#11245A]">
              Points:
            </span>
            <span className="text-xl md:text-2xl font-semibold text-[#11245A]">
              {points}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-6 h-6 mt-1 text-[#11245A]" />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-medium text-[#11245A]">
              Practice Time:
            </span>
            <span className="text-xl md:text-2xl font-semibold text-[#11245A]">
              {Math.floor(practiceTime / 60)} min
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Music className="w-6 h-6 mt-1 text-[#11245A]" />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-medium text-[#11245A]">
              Today:
            </span>
            <span className="text-xl md:text-2xl font-semibold text-[#11245A]">
              {dailyPoints} points
            </span>
            <span className="text-sm text-gray-600">
              {Math.floor(dailyPracticeTime / 60)} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;