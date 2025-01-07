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

const Timer = ({ isActive, timeLeft, chordChanges, isPaused }: TimerProps) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const [leftChordSvg, setLeftChordSvg] = useState<string>('');
  const [rightChordSvg, setRightChordSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isActive && !isPaused) {
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
    } else if (!isActive) {
      setCurrentPair(null);
      setLeftChordSvg('');
      setRightChordSvg('');
    }
  }, [isActive, isPaused]);

  useEffect(() => {
    const fetchChordDiagrams = async () => {
      if (!currentPair) return;
      
      setIsLoading(true);
      const [leftChord, rightChord] = currentPair.split('-');
      
      try {
        // Fetch left chord diagram
        const leftResponse = await supabase.functions.invoke('generate-chord-diagram', {
          body: { chord: leftChord }
        });
        if (leftResponse.error) throw leftResponse.error;
        setLeftChordSvg(leftResponse.data.svg);

        // Fetch right chord diagram
        const rightResponse = await supabase.functions.invoke('generate-chord-diagram', {
          body: { chord: rightChord }
        });
        if (rightResponse.error) throw rightResponse.error;
        setRightChordSvg(rightResponse.data.svg);
      } catch (error) {
        console.error('Error fetching chord diagrams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChordDiagrams();
  }, [currentPair]);

  const [leftChord, rightChord] = currentPair?.split('-') || ['', ''];

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
        isActive={isActive && !isLoading}
      />
      <div className="flex flex-col items-center">
        <TimerCircle 
          isActive={isActive && !isLoading}
          timeLeft={timeLeft}
          chordChanges={chordChanges}
          chordPair={currentPair || ''}
        />
        {isActive && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="grid grid-cols-2 gap-8 px-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-[#11245A] mb-4">{leftChord}</div>
                <div className="bg-white rounded-lg shadow-lg p-6 w-full aspect-square flex items-center justify-center">
                  {leftChordSvg && (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: leftChordSvg }} 
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-[#11245A] mb-4">{rightChord}</div>
                <div className="bg-white rounded-lg shadow-lg p-6 w-full aspect-square flex items-center justify-center">
                  {rightChordSvg && (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: rightChordSvg }} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Timer;