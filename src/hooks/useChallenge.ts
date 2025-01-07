import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { playEndSound } from '@/utils/audio';
import type { Database } from '@/integrations/supabase/types';

type ChordPair = Database['public']['Enums']['chord_pair'];

export const useChallenge = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [chordChanges, setChordChanges] = useState(0);
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      saveResults();
      playEndSound();
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
  }, [isActive, isPaused, timeLeft, chordChanges, toast]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && isActive && !isPaused) {
      event.preventDefault();
      setChordChanges((prev) => prev + 1);
    }
  }, [isActive, isPaused]);

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
    const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
    const randomPair = chordPairs[Math.floor(Math.random() * chordPairs.length)];
    setCurrentPair(randomPair);
    setIsActive(true);
    setIsPaused(false);
    setTimeLeft(60);
    setChordChanges(0);
  };

  const stopChallenge = () => {
    setIsActive(false);
    setIsPaused(false);
    toast({
      title: "Challenge stopped",
      description: "Remember, you need to complete the full 60 seconds to track your progress.",
    });
  };

  return {
    isActive,
    isPaused,
    timeLeft,
    chordChanges,
    currentPair,
    startChallenge,
    stopChallenge
  };
};