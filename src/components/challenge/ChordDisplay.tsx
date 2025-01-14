import { Loader2 } from 'lucide-react';
import TimerCircle from './TimerCircle';

interface ChordDisplayProps {
  isLoading: boolean;
  showContent: boolean;
  leftChord: string;
  rightChord: string;
  leftChordSvg: string;
  rightChordSvg: string;
  timeLeft: number;
  chordChanges: number;
  currentPair: string;
}

const ChordDisplay = ({
  isLoading,
  showContent,
  leftChord,
  rightChord,
  leftChordSvg,
  rightChordSvg,
  timeLeft,
  chordChanges,
  currentPair,
}: ChordDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#11245A]" />
      </div>
    );
  }

  if (!showContent) {
    return null;
  }

  return (
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
      
      {/* Timer Circle */}
      <div className="flex flex-col items-center order-3 md:order-2">
        <TimerCircle 
          isActive={showContent}
          timeLeft={timeLeft}
          chordChanges={chordChanges}
          chordPair={currentPair}
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
  );
};

export default ChordDisplay;