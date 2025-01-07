import TimerCircle from './TimerCircle';
import TimerHeader from './TimerHeader';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
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
      />
    </>
  );
};

export default Timer;