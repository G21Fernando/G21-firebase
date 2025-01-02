import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import MetronomeControl from '@/components/MetronomeControl';
import StatsCard from '@/components/StatsCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import ProfileEditDialog from '@/components/ProfileEditDialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound } from 'lucide-react';

const Index = () => {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPracticeTime, setDailyPracticeTime] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setDailyPoints(data.daily_points || 0);
        setDailyPracticeTime(data.daily_practice_time || 0);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePracticeTimeUpdate = async (sessionTime: number) => {
    if (!session?.user) return;

    try {
      const newPracticeTime = dailyPracticeTime + sessionTime;
      setDailyPracticeTime(newPracticeTime);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          practice_time: (profile.practice_time || 0) + sessionTime,
          daily_practice_time: newPracticeTime,
          last_practice_date: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating practice time:', error);
    }
  };

  const handlePointsUpdate = async (sessionPoints: number) => {
    if (!session?.user) return;

    try {
      const newDailyPoints = dailyPoints + sessionPoints;
      setDailyPoints(newDailyPoints);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: (profile.points || 0) + sessionPoints,
          daily_points: newDailyPoints,
          last_practice_date: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex-grow text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-[#1A1F2C]">
              Stop scrolling Start strumming
            </h1>
          </div>
          <div className="flex-shrink-0">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 md:h-auto md:w-auto md:px-4 rounded-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">{profile?.username}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profile && (
                    <ProfileEditDialog
                      currentUsername={profile.username}
                      currentAvatarUrl={profile.avatar_url}
                      userId={session.user.id}
                      onProfileUpdate={fetchProfile}
                    />
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#E2D1C3] p-4 md:p-6 rounded-lg shadow-md">
            <StatsCard 
              points={dailyPoints}
              practiceTime={dailyPracticeTime}
            />
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <MetronomeControl 
              onPointsUpdate={handlePointsUpdate}
              onPracticeTimeUpdate={handlePracticeTimeUpdate}
            />
          </div>

          <div className="bg-[#f3f3f3] p-4 md:p-6 rounded-lg shadow-md">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;