import React, { useEffect, useState } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Profile {
  username: string;
  points: number;
  cpm?: number;
}

const LeaderboardCard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // First get the regular points leaderboard
      const { data: pointsData } = await supabase
        .from('profiles')
        .select('username, points')
        .order('points', { ascending: false })
        .limit(5);
      
      if (pointsData) {
        // Then get the sprint results for these users
        const usernames = pointsData.map(profile => profile.username);
        const { data: sprintData } = await supabase
          .from('chord_sprinter_results')
          .select(`
            reps,
            user_id,
            profiles!chord_sprinter_results_user_id_fkey (username)
          `)
          .in('user_id', pointsData.map(p => p.id))
          .order('reps', { ascending: false });

        const enhancedData = pointsData.map(profile => {
          const sprintResult = sprintData?.find(
            sprint => sprint.profiles.username === profile.username
          );
          return {
            ...profile,
            cpm: sprintResult ? sprintResult.reps : undefined
          };
        });
        setLeaderboardData(enhancedData);
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
    <div className="p-4 h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 md:w-6 h-4 md:h-6 text-yellow-500" />
        <h2 className="text-base md:text-2xl font-bold">Practice Leaderboard</h2>
      </div>
      
      <ul className="space-y-2 md:space-y-4">
        {leaderboardData.map((player, index) => (
          <li 
            key={player.username}
            className="flex justify-between items-center p-2 md:p-4 bg-white/50 backdrop-blur-sm rounded-lg"
          >
            <span className="flex items-center gap-1 md:gap-2">
              <span className="font-bold text-gray-500 text-xs md:text-base">#{index + 1}</span>
              <span className="text-xs md:text-base">{player.username}</span>
              {player.points >= 1000 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Level 1 Completed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-xs md:text-base">{player.points} pts</span>
              {player.cpm && (
                <span className="text-xs text-gray-500">{player.cpm} CPM</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardCard;