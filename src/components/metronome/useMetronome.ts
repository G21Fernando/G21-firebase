import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useMetronome = (onPointsUpdate: (points: number) => void, onPracticeTimeUpdate: (seconds: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const sessionPointsRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initAudioContext = () => {
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContext();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.connect(audioContext.current.destination);
      gainNode.current.gain.value = volume;
    }
  };

  useEffect(() => {
    initAudioContext();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNode.current && audioContext.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);

  const playTick = () => {
    if (!audioContext.current || !gainNode.current) return;
    
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }

    const oscillator = audioContext.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    
    oscillator.connect(gainNode.current);
    
    const now = audioContext.current.currentTime;
    const duration = 0.1;
    
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    setTimeout(() => {
      oscillator.disconnect();
    }, duration * 1000);

    setIndicator(prev => !prev);
    sessionPointsRef.current += 1;
    setCurrentPoints(sessionPointsRef.current);
  };

  const logActivity = async (points: number, practiceTime: number) => {
    if (!supabase.auth.getUser()) return;

    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          activity_type: 'metronome_practice',
          points_earned: points,
          practice_time: practiceTime,
          details: { bpm }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const startMetronome = async () => {
    if (!isPlaying) {
      initAudioContext();
      if (audioContext.current && audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
      
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      sessionPointsRef.current = 0;
      setCurrentPoints(0);
      const interval = (60 / bpm) * 1000;
      
      playTick();
      intervalRef.current = setInterval(() => {
        playTick();
      }, interval);

      // Set timeout for 4 minutes
      timeoutRef.current = setTimeout(() => {
        stopMetronome();
        setShowContinuePrompt(true);
      }, 4 * 60 * 1000);
    }
  };

  const stopMetronome = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const practiceTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onPracticeTimeUpdate(practiceTime);
      onPointsUpdate(sessionPointsRef.current);
      logActivity(sessionPointsRef.current, practiceTime);
      setCurrentPoints(0);
    }
  };

  const handleBpmChange = (value: string) => {
    const newBpm = parseInt(value);
    setBpm(newBpm);
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const interval = (60 / newBpm) * 1000;
      intervalRef.current = setInterval(() => {
        playTick();
      }, interval);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
  };

  const handleContinue = () => {
    setShowContinuePrompt(false);
    startMetronome();
  };

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
