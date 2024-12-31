import React from 'react';
import { Card } from '@/components/ui/card';
import { Link2 } from 'lucide-react';

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
    <Card className="mt-6 p-6 bg-[#E2D1C3] max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Today stats:</h2>
      <ul className="space-y-4 text-lg">
        <li>• Practice time: {formatTime(practiceTime)}</li>
        <li className="flex items-center gap-2">
          • Points: {points} <Link2 className="w-4 h-4" />
        </li>
      </ul>
    </Card>
  );
};

export default StatsCard;