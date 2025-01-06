import { Zap } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
  return (
    <>
      <div className="text-center mb-3">
        <div className="text-3xl font-bold text-neutral-600">Chord Sprinter</div>
        <div className="text-lg text-gray-600 mt-1">Speed up your chord changes and track results</div>
      </div>
      <div className="relative w-48 h-48 mb-6 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isActive && <Zap className="w-20 h-20 text-[#11245A]" />}
        </div>
        <div className="absolute inset-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-[#D3E4FD]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
            <circle
              className="text-[#11245A]"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (timeLeft / 60)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isActive && (
            <>
              <span className="text-5xl font-bold mb-1 text-[#11245A]">{chordChanges}</span>
              <span className="text-sm text-[#11245A]/70">Chord changes done</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;