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
    <div className="p-6 h-full flex flex-col justify-center gap-4">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-[#11245A]" />
        <div className="flex items-center">
          <span className="text-base text-[#11245A]">
            Minutes Mastered: {formatTime(practiceTime)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <GuitarIcon className="w-5 h-5 text-[#11245A]" />
        <span className="text-base text-[#11245A]">Points: {points}</span>
        <Link2 className="w-4 h-4 text-[#11245A] opacity-80" />
      </div>
    </div>
  );
};

export default StatsCard;