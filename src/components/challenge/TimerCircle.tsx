import { Zap } from 'lucide-react';

interface TimerCircleProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  chordPair: string;
}

const TimerCircle = ({ isActive, timeLeft, chordChanges, chordPair }: TimerCircleProps) => {
  return (
    <div className="relative w-44 h-44 mb-4 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && <Zap className="w-16 h-16 text-[#11245A]" />}
      </div>
      <div className="absolute inset-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            className="text-[#D3E4FD]"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="70"
            cx="80"
            cy="80"
          />
          <circle
            className="text-[#11245A]"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (timeLeft / 60)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="70"
            cx="80"
            cy="80"
          />
        </svg>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isActive && (
          <>
            <span className="text-4xl font-bold mb-0.5 text-[#11245A]">{chordChanges}</span>
            <span className="text-xs text-[#11245A]/70">Chord changes done</span>
            <span className="text-sm font-semibold text-[#11245A] mt-1">{chordPair}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default TimerCircle;