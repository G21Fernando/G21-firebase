import React from 'react';
import { Card } from '@/components/ui/card';
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
    <Card className="bg-[#E2D1C3] p-8 rounded-xl shadow-lg">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-[#1A1F2C] mb-8">
          Your today stats:
        </h2>
        
        <div className="space-y-6 text-lg text-[#1A1F2C]">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#1A1F2C]" />
            <span className="flex items-center gap-1">
              <span className="font-medium">Practice</span> {formatTime(practiceTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <GuitarIcon className="w-6 h-6 text-[#1A1F2C]" />
            <span className="font-medium">Points: {points}</span>
            <Link2 className="w-5 h-5 text-[#1A1F2C] opacity-80" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;