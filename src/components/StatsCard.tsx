import React from 'react';
import { Clock, GuitarIcon, Link2 } from 'lucide-react';

interface StatsCardProps {
  practiceTime: number;
  points: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ practiceTime, points }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-4 md:p-10">
      <h2 className="text-xl md:text-3xl font-bold text-[#1A1F2C] mb-4 md:mb-10">
        Your today stats:
      </h2>
      
      <div className="space-y-3 md:space-y-10">
        <div className="flex items-center gap-2 md:gap-4">
          <Clock className="w-5 md:w-7 h-5 md:h-7 text-[#1A1F2C]" />
          <span className="text-base md:text-2xl text-[#1A1F2C]">
            <span className="font-medium">Practice:</span>{' '}
            {formatTime(practiceTime)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <GuitarIcon className="w-5 md:w-7 h-5 md:h-7 text-[#1A1F2C]" />
          <span className="text-base md:text-2xl font-medium text-[#1A1F2C]">Points: {points}</span>
          <Link2 className="w-4 md:w-6 h-4 md:h-6 text-[#1A1F2C] opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;