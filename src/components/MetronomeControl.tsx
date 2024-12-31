import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface MetronomeControlProps {
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (seconds: number) => void;
}

const MetronomeControl: React.FC<MetronomeControlProps> = ({ onPointsUpdate, onPracticeTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [points, setPoints] = useState(0);
  const [indicator, setIndicator] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { toast } = useToast();

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
      gainNode.gain.value = 0.5;
      
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
      const interval = (60 / bpm) * 1000;
      
      playTick();
      intervalRef.current = setInterval(() => {
        playTick();
        setPoints(prev => {
          const newPoints = prev + 1;
          onPointsUpdate(newPoints);
          return newPoints;
        });
        const practiceTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        onPracticeTimeUpdate(practiceTime);
      }, interval);

      toast({
        title: "Metronome Started",
        description: `Playing at ${bpm} BPM`,
      });
    }
  };

  const stopMetronome = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast({
        title: "Metronome Stopped",
        description: `You earned ${points} points!`,
      });
    }
  };

  const handleBpmChange = (value: string) => {
    const newBpm = parseInt(value);
    setBpm(newBpm);
    if (isPlaying) {
      stopMetronome();
      setTimeout(startMetronome, 100);
    }
  };

  return (
    <Card className="p-6 shadow-lg max-w-md mx-auto">
      <Button 
        className="w-full mb-4 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-xl py-6"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex items-center gap-4 mb-4">
        <Select value={bpm.toString()} onValueChange={handleBpmChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select BPM" />
          </SelectTrigger>
          <SelectContent>
            {[60, 80, 100, 120, 140, 160, 180, 200].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} BPM
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div 
          className={`w-4 h-4 rounded-full bg-[#1A1F2C] metronome-indicator ${
            indicator ? 'active' : ''
          }`}
        />
      </div>

      <div className="text-2xl font-bold text-center">
        Points: {points}
      </div>
    </Card>
  );
};

export default MetronomeControl;