import React from 'react';
import { Link2, GuitarIcon, Clock } from 'lucide-react';

interface StatsCardProps {
  practiceTime: number;
  points: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ practiceTime, points }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes and ${remainingSeconds} seconds`;
  };

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1A1F2C] mb-8">
        Your today stats:
      </h2>
      
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-[#1A1F2C] mt-1" />
          <div className="flex flex-col">
            <span className="text-lg md:text-xl">
              <span className="font-medium">Practice time:</span>{' '}
              {formatTime(practiceTime)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <GuitarIcon className="w-6 h-6 text-[#1A1F2C]" />
          <span className="text-lg md:text-xl font-medium">Points: {points}</span>
          <Link2 className="w-5 h-5 text-[#1A1F2C] opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;