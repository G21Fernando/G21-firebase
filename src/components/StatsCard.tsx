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
    <Card className="bg-[#E2D1C3]">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your today stats:</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center gap-2">
            <span className="flex items-center">
              <Clock className="w-5 h-5" /> Practice
            </span>
            time: {formatTime(practiceTime)}
          </li>
          <li className="flex items-center gap-2">
            <GuitarIcon className="w-4 h-4" /> Points: {points} <Link2 className="w-4 h-4" />
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default StatsCard;