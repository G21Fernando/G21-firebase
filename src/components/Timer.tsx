import TimerCircle from './challenge/TimerCircle';
import TimerHeader from './challenge/TimerHeader';
import ChordDisplay from './challenge/ChordDisplay';
import { useChordDiagrams } from '@/hooks/useChordDiagrams';

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