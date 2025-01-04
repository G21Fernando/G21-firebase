import React from 'react';
import { Link2, GuitarIcon, Clock } from 'lucide-react';

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
    <div className="p-3 md:p-10 h-full flex flex-col justify-center">
      <div className="space-y-2 md:space-y-10">
        <div className="flex items-center gap-2 md:gap-4">
          <Clock className="w-4 md:w-7 h-4 md:h-7 text-[#1A1F2C]" />
          <div className="flex items-center">
            <span className="text-sm md:text-2xl text-[#1A1F2C]">
              Practice time: {formatTime(practiceTime)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <GuitarIcon className="w-4 md:w-7 h-4 md:h-7 text-[#1A1F2C]" />
          <span className="text-sm md:text-2xl text-[#1A1F2C]">Points: {points}</span>
          <Link2 className="w-3 md:w-6 h-3 md:h-6 text-[#1A1F2C] opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;