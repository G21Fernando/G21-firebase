import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import LeaderboardCard from '@/components/LeaderboardCard';
import ChallengeStats from '@/components/challenge/ChallengeStats';
import ChallengeMain from '@/components/challenge/ChallengeMain';
import ChordSprintResults from '@/components/challenge/ChordSprintResults';
import { Analytics } from '@/utils/analytics';
import { useToast } from '@/hooks/use-toast';
import { useChallenge } from '@/hooks/useChallenge';

const Challenge = () => {
  const [profile, setProfile] = useState<any>(null);
  const session = useSession();
  const { toast } = useToast();
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

  const handleStartChallenge = () => {
    if (session?.user) {
      Analytics.trackChordSprintStart(session.user.id);
    }
    startChallenge();
  };

  const handleStopChallenge = async () => {
    if (session?.user) {
      // Award points when the challenge ends (60 points per transition)
      const pointsEarned = chordChanges * 60;
      
      try {
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('points, daily_points')
          .eq('id', session.user.id)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            points: (profile?.points || 0) + pointsEarned,
            daily_points: (profile?.daily_points || 0) + pointsEarned,
            last_practice_date: new Date().toISOString()
          })
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        toast({
          title: "Points earned!",
          description: `You earned ${pointsEarned} points for completing ${chordChanges} transitions!`,
        });

        fetchProfile(); // Refresh profile data
      } catch (error: any) {
        console.error('Error updating points:', error);
        toast({
          title: "Error updating points",
          description: error.message,
          variant: "destructive",
        });
      }

      Analytics.trackChordSprintComplete(
        session.user.id,
        'current-chord-pair',
        chordChanges
      );
      Analytics.trackPracticeTime(session.user.id, 60 - timeLeft);
    }
    stopChallenge();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="container mx-auto px-4 py-6 pb-24 md:py-8 md:pb-8">
        <div className="mb-6">
          <ChallengeMain 
            isActive={isActive}
            timeLeft={timeLeft}
            chordChanges={chordChanges}
            onStart={handleStartChallenge}
            onStop={handleStopChallenge}
            isPaused={isPaused}
          />
        </div>
        <div className="mb-6">
          <ChordSprintResults />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ChallengeStats profile={profile} />
          <div className="md:col-span-2">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;