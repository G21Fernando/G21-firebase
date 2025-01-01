import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { supabase } from "@/integrations/supabase/client";

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
  const practiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const practiceTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (practiceIntervalRef.current) {
        clearInterval(practiceIntervalRef.current);
      }
    };
  }, []);

  const updateProfileStats = async (newPoints: number, newPracticeTime: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          points: newPoints,
          practice_time: newPracticeTime
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile stats:', error);
    }
  };

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
      
      requestAnimationFrame(() => {
        setIndicator(true);
        setTimeout(() => {
          setIndicator(false);
        }, 100);
      });
    }
  };

  const startMetronome = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      const interval = (60 / bpm) * 1000;
      
      playTick();
      intervalRef.current = setInterval(playTick, interval);

      // Start tracking practice time
      practiceIntervalRef.current = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        practiceTimeRef.current = currentTime;
        onPracticeTimeUpdate(currentTime);
      }, 1000);

      // Start tracking points
      setInterval(() => {
        setPoints(prev => {
          const newPoints = prev + 1;
          onPointsUpdate(newPoints);
          updateProfileStats(newPoints, practiceTimeRef.current);
          return newPoints;
        });
      }, interval);
    }
  };

  const stopMetronome = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (practiceIntervalRef.current) {
        clearInterval(practiceIntervalRef.current);
      }
      const finalPracticeTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      practiceTimeRef.current = finalPracticeTime;
      onPracticeTimeUpdate(finalPracticeTime);
      updateProfileStats(points, finalPracticeTime);
      setIndicator(false);
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
          className={`w-4 h-4 rounded-full transition-colors duration-50 ${
            indicator ? 'bg-green-500' : 'bg-[#1A1F2C]'
          }`}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Volume</p>
        <Slider
          value={[volume * 100]}
          onValueChange={(value) => setVolume(value[0] / 100)}
          max={100}
          step={1}
        />
      </div>

      <div className="text-2xl font-bold text-center">
        Points: {points}
      </div>
    </Card>
  );
};

export default MetronomeControl;