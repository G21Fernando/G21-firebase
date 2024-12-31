import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const LeaderboardCard: React.FC = () => {
  // This is a mock leaderboard data - you can replace it with real data later
  const leaderboardData = [
    { name: "Alex", points: 1200 },
    { name: "Sam", points: 900 },
    { name: "Jordan", points: 750 },
    { name: "Taylor", points: 600 },
    { name: "Casey", points: 450 },
  ];

  return (
    <Card className="bg-[#f3f3f3]">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        
        <ul className="space-y-4">
          {leaderboardData.map((player, index) => (
            <li 
              key={player.name}
              className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-gray-500">#{index + 1}</span>
                <span>{player.name}</span>
              </span>
              <span className="font-semibold">{player.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default LeaderboardCard;