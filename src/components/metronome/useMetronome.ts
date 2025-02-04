import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useMetronomeSound } from './useMetronomeSound';

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
    setIsPlaying(true);
    startTimer();
    
    // Log the activity
    if (session?.user) {
      try {
        await supabase
          .from('user_activity_logs')
          .insert({
            user_id: session.user.id,
            activity_type: 'metronome_start',
            details: { bpm }
          });
      } catch (error) {
        console.error('Error logging metronome activity:', error);
      }
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