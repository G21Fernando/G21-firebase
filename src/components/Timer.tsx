import TimerCircle from './challenge/TimerCircle';
import TimerHeader from './challenge/TimerHeader';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

type ChordPair = Database['public']['Enums']['chord_pair'];

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  isPaused: boolean;
}

// Cache object to store chord diagrams
const chordDiagramCache: { [key: string]: string } = {};

const Timer = ({ isActive, timeLeft, chordChanges, isPaused }: TimerProps) => {
  const chordPairs: ChordPair[] = ['Am-C', 'Em-G', 'Dm-G', 'Am-F', 'C-G', 'Em-Am'];
  const [currentPair, setCurrentPair] = useState<ChordPair | null>(null);
  const [leftChordSvg, setLeftChordSvg] = useState<string>('');
  const [rightChordSvg, setRightChordSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const fetchChordDiagram = useCallback(async (chord: string) => {
    console.log('Fetching chord diagram for:', chord);
    
    // Check if diagram is already in cache
    if (chordDiagramCache[chord]) {
      console.log('Using cached diagram for:', chord);
      return chordDiagramCache[chord];
    }

    // If not in cache, fetch from API
    const response = await supabase.functions.invoke('generate-chord-diagram', {
      body: { chord }
    });
    
    if (response.error) {
      console.error('Error fetching chord diagram:', response.error);
      throw response.error;
    }
    
    console.log('Successfully fetched diagram for:', chord);
    // Store in cache and return
    chordDiagramCache[chord] = response.data.svg;
    return response.data.svg;
  }, []);

  useEffect(() => {
    if (isActive && !isPaused && !isLoading) {
      setIsLoading(true);
      console.log('Setting new chord pair');
      const randomIndex = Math.floor(Math.random() * chordPairs.length);
      setCurrentPair(chordPairs[randomIndex]);
      setIsReady(false);
    } else if (!isActive) {
      console.log('Resetting chord pair');
      setCurrentPair(null);
      setLeftChordSvg('');
      setRightChordSvg('');
      setIsReady(false);
      setIsLoading(false);
    }
  }, [isActive, isPaused, isLoading, chordPairs]);

  useEffect(() => {
    const loadChordDiagrams = async () => {
      if (!currentPair) return;
      
      console.log('Loading chord diagrams for pair:', currentPair);
      const [leftChord, rightChord] = currentPair.split('-');
      
      try {
        // Fetch both diagrams concurrently
        const [leftSvg, rightSvg] = await Promise.all([
          fetchChordDiagram(leftChord),
          fetchChordDiagram(rightChord)
        ]);

        setLeftChordSvg(leftSvg);
        setRightChordSvg(rightSvg);
        setIsReady(true);
        setIsLoading(false);
        console.log('Successfully loaded both chord diagrams');
      } catch (error) {
        console.error('Error loading chord diagrams:', error);
        setIsLoading(false);
      }
    };

    loadChordDiagrams();
  }, [currentPair, fetchChordDiagram]);

  const [leftChord, rightChord] = currentPair?.split('-') || ['', ''];

  const showContent = isActive && isReady && !isLoading;

  return (
    <>
      <TimerHeader 
        title="Chord Sprinter"
        subtitle="Speed up your chord changes and track results"
        isActive={showContent}
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
        {isLoading && (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#11245A]" />
          </div>
        )}
        
        {showContent && (
          <>
            {/* Left/Top Chord */}
            <div className="flex flex-col items-center order-1 md:order-1">
              <div className="text-xl font-bold text-[#11245A]">{leftChord}</div>
              <div className="bg-white rounded-lg shadow-md">
                {leftChordSvg && (
                  <div 
                    className="w-[100px] h-[105px]"
                    dangerouslySetInnerHTML={{ __html: leftChordSvg }} 
                  />
                )}
              </div>
            </div>
            
            {/* Timer Circle - Always in the middle */}
            <div className="flex flex-col items-center order-3 md:order-2">
              <TimerCircle 
                isActive={showContent}
                timeLeft={timeLeft}
                chordChanges={chordChanges}
                chordPair={currentPair || ''}
              />
            </div>

            {/* Right/Bottom Chord */}
            <div className="flex flex-col items-center order-2 md:order-3">
              <div className="text-xl font-bold text-[#11245A]">{rightChord}</div>
              <div className="bg-white rounded-lg shadow-md">
                {rightChordSvg && (
                  <div 
                    className="w-[100px] h-[105px]"
                    dangerouslySetInnerHTML={{ __html: rightChordSvg }} 
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Timer;