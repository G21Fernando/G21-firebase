import { Zap } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
  return (
    <>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-neutral-600">Chord Sprinter</div>
        <div className="text-lg text-gray-600 mt-2">Speed up your chord changes and track results</div>
      </div>
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isActive && <Zap className="w-24 h-24 text-[#11245A]" />}
        </div>
        <div className="absolute inset-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-[#D3E4FD]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
            <circle
              className="text-[#11245A]"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (timeLeft / 60)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isActive && (
            <>
              <span className="text-6xl font-bold mb-2 text-[#11245A]">{chordChanges}</span>
              <span className="text-sm text-[#11245A]/70">Chord changes done</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;