import { useState, useRef, useEffect } from 'react';

export const useMetronome = (onPointsUpdate: (points: number) => void, onPracticeTimeUpdate: (seconds: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioContext = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const sessionPointsRef = useRef<number>(0);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playTick = () => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = volume;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.05);
      oscillator.stop(audioContext.current.currentTime + 0.05);
      
      setIndicator(prev => !prev);
    }
  };

  const startMetronome = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      sessionPointsRef.current = 0;
      const interval = (60 / bpm) * 1000;
      
      playTick();
      intervalRef.current = setInterval(() => {
        playTick();
        sessionPointsRef.current += 1;
      }, interval);
    }
  };

  const stopMetronome = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const practiceTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onPracticeTimeUpdate(practiceTime);
      onPointsUpdate(sessionPointsRef.current);
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
        sessionPointsRef.current += 1;
      }, interval);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
  };

  return {
    isPlaying,
    bpm,
    indicator,
    volume,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
  };
};