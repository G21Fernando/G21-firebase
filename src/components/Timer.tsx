import TimerCircle from './challenge/TimerCircle';
import TimerHeader from './challenge/TimerHeader';
import ChordDisplay from './challenge/ChordDisplay';
import { useChordDiagrams } from '@/hooks/useChordDiagrams';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  isPaused: boolean;
}

const Timer = ({ isActive, timeLeft, chordChanges, isPaused }: TimerProps) => {
  const {
    currentPair,
    leftChordSvg,
    rightChordSvg,
    isLoading,
    isReady,
  } = useChordDiagrams(isActive, isPaused);

  useEffect(() => {
    // Subscribe to real-time updates for chord_sprinter_results
    const channel = supabase
      .channel('chord-sprinter-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chord_sprinter_results'
        },
        (payload) => {
          console.log('New chord sprint result:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        <ChordDisplay 
          isLoading={isLoading}
          showContent={showContent}
          leftChord={leftChord}
          rightChord={rightChord}
          leftChordSvg={leftChordSvg}
          rightChordSvg={rightChordSvg}
          timeLeft={timeLeft}
          chordChanges={chordChanges}
          currentPair={currentPair || ''}
        />
      </div>
    </>
  );
};

export default Timer;