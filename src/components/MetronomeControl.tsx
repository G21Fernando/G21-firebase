import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface MetronomeControlProps {
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (seconds: number) => void;
}

const MetronomeControl: React.FC<MetronomeControlProps> = ({ onPointsUpdate, onPracticeTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [points, setPoints] = useState(0);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContext = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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
      const interval = (60 / bpm) * 1000;
      
      playTick();
      intervalRef.current = setInterval(() => {
        playTick();
        setPoints(prev => {
          const newPoints = prev + 1;
          onPointsUpdate(newPoints);
          return newPoints;
        });
        const currentPracticeTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        onPracticeTimeUpdate(currentPracticeTime);
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
        setPoints(prev => {
          const newPoints = prev + 1;
          onPointsUpdate(newPoints);
          return newPoints;
        });
      }, interval);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
  };

  return (
    <Card className="p-6 shadow-lg max-w-md mx-auto">
      <Button 
        className="w-full mb-4 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-xl py-6"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
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

        <div className="w-full md:w-40">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Volume</span>
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-grow"
            />
          </div>
        </div>
      </div>

      <div className="text-2xl font-bold text-center">
        Points: {points}
      </div>
    </Card>
  );
};

export default MetronomeControl;