import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Timer from '@/components/challenge/Timer';
import ChallengeControls from '@/components/challenge/ChallengeControls';
import LeaderboardCard from '@/components/LeaderboardCard';
import StatsCard from '@/components/StatsCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ExerciseSidebar } from '@/components/exercises/ExerciseSidebar';

const Challenge = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [chordChanges, setChordChanges] = useState(0);
  const session = useSession();
  const { toast } = useToast();

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
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast({
        title: "Challenge completed!",
        description: `You completed ${chordChanges} chord changes in 60 seconds!`,
      });
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, chordChanges]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && isActive) {
      setChordChanges((prev) => prev + 1);
    }
  }, [isActive]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const startChallenge = () => {
    setIsActive(true);
    setTimeLeft(60);
    setChordChanges(0);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
        <Header 
          profile={profile}
          onProfileUpdate={fetchProfile}
        />
        <SidebarProvider>
          <div className="flex w-full">
            <ExerciseSidebar />
            <div className="flex-1">
              <div className="container mx-auto pt-24 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column - Stats */}
                  <div className="bg-white rounded-lg shadow-lg">
                    <StatsCard 
                      practiceTime={profile?.daily_practice_time || 0}
                      points={profile?.daily_points || 0}
                    />
                  </div>
                  
                  {/* Center Column - Challenge */}
                  <div className="flex flex-col items-center">
                    <Timer 
                      isActive={isActive}
                      timeLeft={timeLeft}
                      chordChanges={chordChanges}
                    />
                    <ChallengeControls 
                      isActive={isActive}
                      timeLeft={timeLeft}
                      onStart={startChallenge}
                    />
                  </div>
                  
                  {/* Right Column - Leaderboard */}
                  <div className="bg-white rounded-lg shadow-lg">
                    <LeaderboardCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
};

export default Challenge;