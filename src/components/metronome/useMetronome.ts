import { useState, useRef, useEffect } from 'react';

export const useMetronome = (onPointsUpdate: (points: number) => void, onPracticeTimeUpdate: (seconds: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentPoints, setCurrentPoints] = useState(0);
  
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const sessionPointsRef = useRef<number>(0);

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
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(volume, audioContext.current?.currentTime || 0);
    }
  }, [volume]);

  const playTick = () => {
    if (!audioContext.current || !gainNode.current) return;
    
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }

    const oscillator = audioContext.current.createOscillator();
    oscillator.connect(gainNode.current);
    oscillator.frequency.value = 800;
    
    const now = audioContext.current.currentTime;
    const attackTime = 0.001;
    const decayTime = 0.05;
    
    // Reset gain to ensure consistent volume
    gainNode.current.gain.cancelScheduledValues(now);
    gainNode.current.gain.setValueAtTime(volume, now);
    
    // Attack
    gainNode.current.gain.linearRampToValueAtTime(volume, now + attackTime);
    // Decay
    gainNode.current.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime);
    
    oscillator.start(now);
    oscillator.stop(now + attackTime + decayTime);
    
    setIndicator(prev => !prev);
    sessionPointsRef.current += 1;
    setCurrentPoints(sessionPointsRef.current);
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

  return {
    isPlaying,
    bpm,
    indicator,
    volume,
    currentPoints,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
  };
};