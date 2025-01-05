import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

const Index = () => {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPracticeTime, setDailyPracticeTime] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const supabase = useSupabaseClient();

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
        
        // Check if last practice date is from a previous day
        const lastPracticeDate = new Date(data.last_practice_date);
        const today = new Date();
        
        if (lastPracticeDate.toDateString() !== today.toDateString()) {
          // If it's a new day, start with fresh daily stats
          setDailyPoints(0);
          setDailyPracticeTime(0);
        } else {
          // If it's the same day, use the stored daily stats
          setDailyPoints(data.daily_points || 0);
          setDailyPracticeTime(data.daily_practice_time || 0);
        }
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