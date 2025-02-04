import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useMetronomeSound } from './useMetronomeSound';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const POINTS_PER_MINUTE = 60;
const IDLE_TIMEOUT = 300000; // 5 minutes in milliseconds

export const useMetronome = (onPointsUpdate: (points: number) => void, onPracticeTimeUpdate: (seconds: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Fetch user profile to get the correct user_id for activity logs
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { playClick } = useMetronomeSound(volume);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => {
        setShowContinuePrompt(true);
        stopMetronome();
      }, IDLE_TIMEOUT);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    
    if (isPlaying) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [isPlaying, resetIdleTimer]);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      const points = Math.floor((elapsedSeconds / 60) * POINTS_PER_MINUTE);
      setCurrentPoints(points);
      onPointsUpdate(points);
      onPracticeTimeUpdate(elapsedSeconds);
    }, 1000);
  };

  const startMetronome = async () => {
    if (!profile?.id) {
      console.error('No profile found');
      toast({
        title: "Error",
        description: "Unable to start metronome. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(true);
    startTimer();
    
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: profile.id,
          activity_type: 'metronome_start',
          details: { bpm }
        });

      if (error) {
        console.error('Error logging metronome activity:', error);
        toast({
          title: "Warning",
          description: "Started metronome but couldn't log activity.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error logging metronome activity:', error);
    }
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setCurrentPoints(0);
    startTimeRef.current = null;
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleContinue = () => {
    setShowContinuePrompt(false);
    startMetronome();
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;
      intervalRef.current = setInterval(() => {
        setIndicator(prev => !prev);
        playClick();
      }, interval);
      resetIdleTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, playClick, resetIdleTimer]);

  return {
    isPlaying,
    bpm,
    indicator,
    volume,
    currentPoints,
    showContinuePrompt,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
    handleContinue,
  };
};