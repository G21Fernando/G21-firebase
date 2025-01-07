import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import LeaderboardCard from '@/components/LeaderboardCard';
import ChallengeStats from '@/components/challenge/ChallengeStats';
import ChallengeMain from '@/components/challenge/ChallengeMain';
import ChordSprintResults from '@/components/challenge/ChordSprintResults';
import { useChallenge } from '@/hooks/useChallenge';

const Challenge = () => {
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const { 
    isActive, 
    isPaused, 
    timeLeft, 
    chordChanges, 
    startChallenge, 
    stopChallenge 
  } = useChallenge();

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="container mx-auto px-4 py-6 pb-24 md:py-8 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ChallengeStats profile={profile} />
          <div className="md:col-span-2">
            <ChallengeMain 
              isActive={isActive}
              timeLeft={timeLeft}
              chordChanges={chordChanges}
              onStart={startChallenge}
              onStop={stopChallenge}
              isPaused={isPaused}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg">
            <LeaderboardCard />
          </div>
        </div>
        <div className="mt-6">
          <ChordSprintResults />
        </div>
      </div>
    </div>
  );
};

export default Challenge;