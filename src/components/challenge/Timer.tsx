import { Zap } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
  return (
    <>
      <div className="text-center mb-2">
        <div className="text-2xl font-bold text-neutral-600">Chord Sprinter</div>
        <div className="text-base text-gray-600 mt-1">Speed up your chord changes and track results</div>
      </div>
      <div className="relative w-36 h-36 mb-4 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isActive && <Zap className="w-16 h-16 text-[#11245A]" />}
        </div>
        <div className="absolute inset-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-[#D3E4FD]"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="68"
              cx="72"
              cy="72"
            />
            <circle
              className="text-[#11245A]"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (timeLeft / 60)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="68"
              cx="72"
              cy="72"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isActive && (
            <>
              <span className="text-4xl font-bold mb-0.5 text-[#11245A]">{chordChanges}</span>
              <span className="text-xs text-[#11245A]/70">Chord changes done</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;