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

  const getChordImageUrl = (chord: string) => {
    return '/lovable-uploads/cb1cfaca-4002-439f-8840-8a4f4ef8650c.png';
  };

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
        isActive={isActive}
      />
      <div className="relative">
        {isActive && (
          <div className="absolute w-full flex justify-between items-start px-4 top-1/2 -translate-y-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#11245A] mb-2">{leftChord}</div>
              <div className="w-24 h-24 relative">
                <img 
                  src={getChordImageUrl(leftChord)}
                  alt={`${leftChord} chord diagram`}
                  className="object-contain"
                  style={{
                    clipPath: `polygon(${getChordClipPath(leftChord)})`
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#11245A] mb-2">{rightChord}</div>
              <div className="w-24 h-24 relative">
                <img 
                  src={getChordImageUrl(rightChord)}
                  alt={`${rightChord} chord diagram`}
                  className="object-contain"
                  style={{
                    clipPath: `polygon(${getChordClipPath(rightChord)})`
                  }}
                />
              </div>
            </div>
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

// Helper function to get the clip path coordinates for each chord
const getChordClipPath = (chord: string) => {
  const chordPositions: { [key: string]: string } = {
    'C': '0% 0% 33.33% 33.33%',
    'A': '33.33% 0% 66.66% 33.33%',
    'G': '66.66% 0% 100% 33.33%',
    'E': '0% 33.33% 33.33% 66.66%',
    'D': '33.33% 33.33% 66.66% 66.66%',
    'F': '66.66% 33.33% 100% 66.66%',
    'Am': '0% 66.66% 33.33% 100%',
    'Dm': '33.33% 66.66% 66.66% 100%',
    'Em': '66.66% 66.66% 100% 100%'
  };
  
  return chordPositions[chord] || '0% 0% 33.33% 33.33%';
};

export default Timer;