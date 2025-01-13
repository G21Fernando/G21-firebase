import TimerCircle from './challenge/TimerCircle';
import TimerHeader from './challenge/TimerHeader';
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
      console.log('Setting new chord pair');
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
    } else if (!isActive) {
      console.log('Resetting chord pair');
      setCurrentPair(null);
    }
  }, [isActive, isPaused, chordPairs]);

  const [leftChord, rightChord] = currentPair?.split('-') || ['', ''];

  const showContent = isActive;

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
        isActive={showContent}
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
        {showContent && (
          <>
            {/* Left/Top Chord */}
            <div className="flex flex-col items-center order-1 md:order-1">
              <div className="text-2xl font-bold text-[#11245A] p-4">{leftChord}</div>
            </div>
          </>
        )}
        
        {/* Timer Circle - Always in the middle */}
        <div className="flex flex-col items-center order-3 md:order-2">
          <TimerCircle 
            isActive={showContent}
            timeLeft={timeLeft}
            chordChanges={chordChanges}
            chordPair={currentPair || ''}
          />
        </div>

        {showContent && (
          <>
            {/* Right/Bottom Chord */}
            <div className="flex flex-col items-center order-2 md:order-3">
              <div className="text-2xl font-bold text-[#11245A] p-4">{rightChord}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Timer;