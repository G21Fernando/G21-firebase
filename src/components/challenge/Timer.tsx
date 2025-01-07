import TimerCircle from './TimerCircle';
import TimerHeader from './TimerHeader';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ChordPair = Database['public']['Enums']['chord_pair'];

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  isPaused: boolean;
}

interface ChordDiagram {
  chord: string;
  image_url: string;
}

const Timer = ({ isActive, timeLeft, chordChanges, isPaused }: TimerProps) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const [chordDiagrams, setChordDiagrams] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchChordDiagrams = async () => {
      const { data, error } = await supabase
        .from('chord_diagrams')
        .select('chord, image_url');

      if (error) {
        console.error('Error fetching chord diagrams:', error);
        return;
      }

      const diagramMap = (data as ChordDiagram[]).reduce((acc, { chord, image_url }) => ({
        ...acc,
        [chord]: image_url
      }), {});

      setChordDiagrams(diagramMap);
    };

    fetchChordDiagrams();
  }, []);

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
          <div className="absolute w-full flex justify-between items-start px-4 top-1/2 -translate-y-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#11245A] mb-2">{leftChord}</div>
              {chordDiagrams[leftChord] && (
                <div className="w-24 h-24 relative">
                  <img 
                    src={chordDiagrams[leftChord]}
                    alt={`${leftChord} chord diagram`}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#11245A] mb-2">{rightChord}</div>
              {chordDiagrams[rightChord] && (
                <div className="w-24 h-24 relative">
                  <img 
                    src={chordDiagrams[rightChord]}
                    alt={`${rightChord} chord diagram`}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
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

export default Timer;