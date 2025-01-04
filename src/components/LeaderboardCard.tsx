import React, { useEffect, useState } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="p-3 md:p-8">
      <div className="flex items-center gap-2 mb-2 md:mb-8">
        <Trophy className="w-4 md:w-6 h-4 md:h-6 text-yellow-500" />
        <h2 className="text-lg md:text-2xl font-bold">G21 Leaderboard</h2>
      </div>
      
      <ul className="space-y-2 md:space-y-4">
        {leaderboardData.map((player, index) => (
          <li 
            key={player.username}
            className="flex justify-between items-center p-2 md:p-4 bg-white/50 backdrop-blur-sm rounded-lg"
          >
            <span className="flex items-center gap-1 md:gap-2">
              <span className="text-sm md:text-base font-bold text-gray-500">#{index + 1}</span>
              <span className="text-sm md:text-base">{player.username}</span>
              {player.points >= 1000 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Shield className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 fill-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Level 1 Completed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
            <span className="text-sm md:text-base font-semibold">{player.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardCard;