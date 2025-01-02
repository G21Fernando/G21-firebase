import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  points: number;
}

const LeaderboardCard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, points')
        .order('points', { ascending: false })
        .limit(5);
      
      if (data) {
        setLeaderboardData(data);
      }
    };

    fetchLeaderboard();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">G21 Leaderboard</h2>
      </div>
      
      <ul className="space-y-4">
        {leaderboardData.map((player, index) => (
          <li 
            key={player.username}
            className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg"
          >
            <span className="flex items-center gap-2">
              <span className="font-bold text-gray-500">#{index + 1}</span>
              <span>{player.username}</span>
            </span>
            <span className="font-semibold">{player.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardCard;