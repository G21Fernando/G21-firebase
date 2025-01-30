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
        const defaultUsername = session.user.email?.split('@')[0] || 'user';
        // Generate default avatar URL using DiceBear Identicon
        const defaultAvatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${defaultUsername}`;

        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: session.user.id,
            username: defaultUsername,
            avatar_url: defaultAvatarUrl,
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
      } else {
        setProfile(existingProfile);
        setDailyPoints(existingProfile.daily_points || 0);
        setDailyPracticeTime(existingProfile.daily_practice_time || 0);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePointsUpdate = async (points: number) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: (profile?.points || 0) + points,
          daily_points: dailyPoints + points 
        })
        .eq('id', session.user.id);

      if (error) throw error;
      
      setDailyPoints(prev => prev + points);
      setProfile(prev => ({
        ...prev,
        points: (prev?.points || 0) + points,
        daily_points: dailyPoints + points
      }));
    } catch (error: any) {
      console.error('Error updating points:', error);
      toast({
        title: "Error updating points",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePracticeTimeUpdate = async (time: number) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          practice_time: (profile?.practice_time || 0) + time,
          daily_practice_time: dailyPracticeTime + time 
        })
        .eq('id', session.user.id);

      if (error) throw error;
      
      setDailyPracticeTime(prev => prev + time);
      setProfile(prev => ({
        ...prev,
        practice_time: (prev?.practice_time || 0) + time,
        daily_practice_time: dailyPracticeTime + time
      }));
    } catch (error: any) {
      console.error('Error updating practice time:', error);
      toast({
        title: "Error updating practice time",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header profile={profile} onProfileUpdate={fetchProfile} />
      <MainContent
        dailyPoints={dailyPoints}
        dailyPracticeTime={dailyPracticeTime}
        onPointsUpdate={handlePointsUpdate}
        onPracticeTimeUpdate={handlePracticeTimeUpdate}
      />
    </>
  );
};

export default Index;