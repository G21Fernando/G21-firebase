import { Zap } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
}

const Timer = ({ isActive, timeLeft, chordChanges }: TimerProps) => {
  return (
    <div className="relative w-64 h-64 mb-8">
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && <Zap className="w-24 h-24 text-neutral-600" />}
      </div>
      <div className="absolute inset-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r="120"
            cx="128"
            cy="128"
          />
          <circle
            className="text-neutral-600"
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
            <span className="text-6xl font-bold mb-2">{chordChanges}</span>
            <span className="text-sm text-neutral-600">Chord changes done</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;