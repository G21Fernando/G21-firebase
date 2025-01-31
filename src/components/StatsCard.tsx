import React from 'react';
import { GuitarIcon, Clock } from 'lucide-react';

interface StatsCardProps {
  practiceTime: number;
  points: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ practiceTime, points }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <div className="flex items-start space-x-3">
        <Clock className="w-6 h-6 text-[#11245A] mt-1" />
        <div className="flex flex-col">
          <span className="text-lg font-medium text-[#11245A]">
            Minutes Mastered Today:
          </span>
          <span className="text-2xl font-semibold text-[#11245A]">
            {formatTime(practiceTime)}
          </span>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <GuitarIcon className="w-6 h-6 text-[#11245A] mt-1" />
        <div className="flex flex-col">
          <span className="text-lg font-medium text-[#11245A]">
            Points:
          </span>
          <span className="text-2xl font-semibold text-[#11245A]">
            {points}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;