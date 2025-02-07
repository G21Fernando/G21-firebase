
import { useRef, useEffect } from 'react';

export const useMetronomeSound = (volume: number) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on component mount
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Cleanup on unmount
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const playClick = async () => {
    if (!audioContextRef.current) {
      console.error('AudioContext not initialized');
      return;
    }

    // Ensure audio context is running
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const currentTime = audioContextRef.current.currentTime;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.value = volume;
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.1);
  };

  return { playClick };
};
