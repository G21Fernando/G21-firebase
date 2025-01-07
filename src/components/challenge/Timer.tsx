import TimerCircle from './TimerCircle';
import TimerHeader from './TimerHeader';
import { useState, useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type ChordPair = Database['public']['Enums']['chord_pair'];

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  isPaused: boolean;
}

const Timer = ({ isActive, timeLeft, chordChanges, isPaused }: TimerProps) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
    } else if (!isActive) {
      setCurrentPair(null);
    }
  }, [isActive, isPaused]);

  const [leftChord, rightChord] = currentPair?.split('-') || ['', ''];

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
        isActive={isActive}
      />
      <div className="relative">
        {isActive && (
          <div className="absolute w-full flex justify-between items-center px-4 top-1/2 -translate-y-1/2 z-10">
            <div className="text-xl font-bold text-[#11245A]">{leftChord}</div>
            <div className="text-xl font-bold text-[#11245A]">{rightChord}</div>
          </div>
        )}
        <TimerCircle 
          isActive={isActive}
          timeLeft={timeLeft}
          chordChanges={chordChanges}
          chordPair={currentPair || ''}
        />
      </div>
    </>
  );
};

export default Timer;