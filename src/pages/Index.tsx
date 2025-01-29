import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPracticeTime, setDailyPracticeTime] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            points: 0,
            practice_time: 0,
            daily_points: 0,
            daily_practice_time: 0,
            last_practice_date: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error creating profile",
            description: insertError.message,
            variant: "destructive",
          });
          return;
        }

        setProfile(newProfile);
        setDailyPoints(0);
        setDailyPracticeTime(0);
        return;
      }
      
      setProfile(existingProfile);
      
      // Check if last practice date is from a previous day
      const lastPracticeDate = new Date(existingProfile.last_practice_date);
      const today = new Date();
      
      if (lastPracticeDate.toDateString() !== today.toDateString()) {
        // If it's a new day, start with fresh daily stats
        setDailyPoints(0);
        setDailyPracticeTime(0);
      } else {
        // If it's the same day, use the stored daily stats
        setDailyPoints(existingProfile.daily_points || 0);
        setDailyPracticeTime(existingProfile.daily_practice_time || 0);
      }
    } catch (error: any) {
      console.error('Error fetching/creating profile:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
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
    } catch (error: any) {
      console.error('Error updating practice time:', error);
      toast({
        title: "Error updating practice time",
        description: error.message,
        variant: "destructive",
      });
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
    } catch (error: any) {
      console.error('Error updating points:', error);
      toast({
        title: "Error updating points",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <MainContent 
        dailyPoints={dailyPoints}
        dailyPracticeTime={dailyPracticeTime}
        onPointsUpdate={handlePointsUpdate}
        onPracticeTimeUpdate={handlePracticeTimeUpdate}
      />
    </div>
  );
};

export default Index;