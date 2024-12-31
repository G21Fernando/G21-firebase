import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProfileMenu } from "@/components/ProfileMenu";
import MetronomeControl from "@/components/MetronomeControl";
import StatsCard from "@/components/StatsCard";
import LeaderboardCard from "@/components/LeaderboardCard";
import { LogIn } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [points, setPoints] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);
  const [profile, setProfile] = useState<{
    username: string;
    avatar_url: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, points, practice_time, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(profile);
        setPoints(profile.points || 0);
        setPracticeTime(profile.practice_time || 0);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setPoints(0);
        setPracticeTime(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handlePointsUpdate = async (newPoints: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setPoints(prev => prev + newPoints);

      const { error } = await supabase
        .from('profiles')
        .update({ points: points + newPoints })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating points:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update points.",
      });
    }
  };

  const handlePracticeTimeUpdate = async (seconds: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setPracticeTime(prev => prev + seconds);

      const { error } = await supabase
        .from('profiles')
        .update({ practice_time: practiceTime + seconds })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating practice time:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update practice time.",
      });
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-6" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-3 md:mb-8">
          <div className="flex-grow text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-[#1A1F2C]">
              Stop scrolling Start strumming
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {profile ? (
              <ProfileMenu
                username={profile.username}
                avatarUrl={profile.avatar_url || undefined}
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <div className="order-2 md:order-1 bg-[#E2D1C3] p-3 md:p-6 rounded-lg shadow-md">
            <StatsCard 
              points={points}
              practiceTime={practiceTime}
            />
          </div>

          <div className="order-1 md:order-2 bg-white p-3 md:p-6 rounded-lg shadow-md">
            <MetronomeControl 
              onPointsUpdate={handlePointsUpdate}
              onPracticeTimeUpdate={handlePracticeTimeUpdate}
            />
          </div>

          <div className="order-3 bg-[#f3f3f3] p-3 md:p-6 rounded-lg shadow-md">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
}