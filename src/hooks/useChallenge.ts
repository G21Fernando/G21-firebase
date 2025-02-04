import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { ChordPair } from '@/components/challenge/types';

export const useChallenge = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chordChanges, setChordChanges] = useState(0);
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopChallenge();
    }

    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  // Handle spacebar press for chord changes
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isActive && !isPaused && event.code === 'Space') {
        event.preventDefault(); // Prevent page scrolling
        setChordChanges(prev => prev + 1);
      }
    };

    if (isActive && !isPaused) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isActive, isPaused]);

  const logActivity = async (activityType: string, details: any = {}) => {
    if (session?.user) {
      try {
        const { error } = await supabase
          .from('user_activity_logs')
          .insert({
            user_id: session.user.id,
            activity_type: activityType,
            details
          });

        if (error) {
          console.error('Error logging activity:', error);
        }
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    }
  };

  const updatePracticeTime = async () => {
    if (session?.user) {
      try {
        // Get current profile data
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('practice_time, daily_practice_time, points, daily_points')
          .eq('id', session.user.id)
          .single();

        if (fetchError) throw fetchError;

        // Add 60 seconds (1 minute) to practice time and 60 points per transition
        const pointsEarned = chordChanges * 60;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            practice_time: (profile?.practice_time || 0) + 60,
            daily_practice_time: (profile?.daily_practice_time || 0) + 60,
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
      } catch (error) {
        console.error('Error updating practice time:', error);
        toast({
          title: "Error updating practice time",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

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
    const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
    const randomPair = chordPairs[Math.floor(Math.random() * chordPairs.length)];
    setCurrentPair(randomPair);
    setIsActive(true);
    setIsPaused(false);
    setTimeLeft(60);
    setChordChanges(0);
    logActivity('chord_sprinter_start', { chord_pair: randomPair });
  };

  const stopChallenge = () => {
    setIsActive(false);
    updatePracticeTime();
    saveResults();
  };

  return {
    timeLeft,
    isActive,
    isPaused,
    chordChanges,
    currentPair,
    startChallenge,
    stopChallenge,
    setIsPaused,
    setChordChanges
  };
};

export default useChallenge;
