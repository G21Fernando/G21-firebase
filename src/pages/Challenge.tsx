import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
        description: `You completed ${reps} reps in 60 seconds!`,
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
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {!isActive && <Zap className="w-24 h-24 text-neutral-600" />}
          </div>
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-gray-200"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
              <circle
                className="text-neutral-600"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / 60)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isActive && (
              <>
                <span className="text-6xl font-bold mb-2">{reps}</span>
                <span className="text-sm text-neutral-600">Reps done</span>
              </>
            )}
          </div>
        </div>
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-2">{timeLeft} seconds</div>
          {!isActive ? (
            <div className="space-y-2">
              <div className="text-xl font-semibold text-neutral-600">Speed Unlocker</div>
              <div className="text-sm text-gray-600">Master Chord Changes and Transform Your Playing in 21 minutes</div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Press spacebar to count reps</div>
          )}
        </div>
        <Button
          size="lg"
          onClick={startChallenge}
          disabled={isActive}
          className="bg-neutral-600 hover:bg-neutral-700 text-white"
        >
          {isActive ? 'Challenge in Progress' : 'Start Challenge'}
        </Button>
      </div>
    </div>
  );
};

export default Challenge;