import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, GuitarIcon } from 'lucide-react';

interface StatsCardProps {
  practiceTime: number;
  points: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ practiceTime, points }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <Card className="bg-[#E2D1C3] p-3 md:p-6 rounded-xl shadow-lg">
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#1A1F2C] mb-4">
          Your today stats:
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-[#1A1F2C] mt-1" />
            <div className="flex flex-col">
              <span className="text-base md:text-lg">
                <span className="font-medium">Practice time:</span>{' '}
                {formatTime(practiceTime)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <GuitarIcon className="w-6 h-6 text-[#1A1F2C]" />
            <span className="text-base md:text-lg font-medium">Points: {points}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;