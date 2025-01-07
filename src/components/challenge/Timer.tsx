import TimerCircle from './TimerCircle';
import TimerHeader from './TimerHeader';
import { useState, useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type ChordPair = Database['public']['Enums']['chord_pair'];

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | ''>('');

  useEffect(() => {
    if (isActive) {
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
    } else {
      setCurrentPair('');
    }
  }, [isActive]);

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
      />
      <TimerCircle 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
        chordPair={currentPair}
      />
    </>
  );
};

export default Timer;