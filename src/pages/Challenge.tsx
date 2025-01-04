import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Timer from '@/components/challenge/Timer';
import ChallengeControls from '@/components/challenge/ChallengeControls';

const Challenge = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [reps, setReps] = useState(0);
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
        description: `You completed ${reps} chord changes in 60 seconds!`,
      });
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, reps]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && isActive) {
      setReps((prev) => prev + 1);
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
    setReps(0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="pt-24 px-4 flex flex-col items-center">
        <Timer 
          isActive={isActive}
          timeLeft={timeLeft}
          reps={reps}
        />
        <ChallengeControls 
          isActive={isActive}
          timeLeft={timeLeft}
          onStart={startChallenge}
        />
      </div>
    </div>
  );
};

export default Challenge;