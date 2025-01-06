import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LeaderboardCard from '@/components/LeaderboardCard';
import ChallengeStats from '@/components/challenge/ChallengeStats';
import ChallengeMain from '@/components/challenge/ChallengeMain';

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
  }, [isActive, timeLeft, chordChanges, toast]);

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
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ChallengeStats profile={profile} />
          <ChallengeMain 
            isActive={isActive}
            timeLeft={timeLeft}
            chordChanges={chordChanges}
            onStart={startChallenge}
          />
          <div className="bg-white rounded-lg shadow-lg">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;