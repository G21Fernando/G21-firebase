import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LeaderboardCard from '@/components/LeaderboardCard';
import ChallengeStats from '@/components/challenge/ChallengeStats';
import ChallengeMain from '@/components/challenge/ChallengeMain';
import ChordSprintResults from '@/components/challenge/ChordSprintResults';

const Challenge = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [chordChanges, setChordChanges] = useState(0);
  const [currentPair, setCurrentPair] = useState<string>('');
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
      saveResults();
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

  const saveResults = async () => {
    if (session?.user && currentPair) {
      const { error } = await supabase
        .from('chord_sprinter_results')
        .insert({
          user_id: session.user.id,
          chord_pair: currentPair,
          reps: chordChanges
        });

      if (error) {
        console.error('Error saving results:', error);
        toast({
          title: "Error saving results",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  const startChallenge = () => {
    const chordPairs = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
    const randomPair = chordPairs[Math.floor(Math.random() * chordPairs.length)];
    setCurrentPair(randomPair);
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
      <div className="container mx-auto px-4 py-6 pb-24 md:py-8 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ChallengeStats profile={profile} />
          <div className="md:col-span-2">
            <ChallengeMain 
              isActive={isActive}
              timeLeft={timeLeft}
              chordChanges={chordChanges}
              onStart={startChallenge}
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