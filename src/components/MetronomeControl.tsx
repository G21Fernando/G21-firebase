import React from 'react';
import { Button } from '@/components/ui/button';
import BpmSelector from './metronome/BpmSelector';
import VolumeControl from './metronome/VolumeControl';
import MetronomeIndicator from './metronome/MetronomeIndicator';
import { useMetronome } from './metronome/useMetronome';

interface MetronomeControlProps {
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (seconds: number) => void;
}

const MetronomeControl: React.FC<MetronomeControlProps> = ({ onPointsUpdate, onPracticeTimeUpdate }) => {
  const {
    isPlaying,
    bpm,
    indicator,
    volume,
    currentPoints,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
  } = useMetronome(onPointsUpdate, onPracticeTimeUpdate);

  return (
    <div className="p-1.5 md:p-10 h-full flex flex-col justify-center">
      <Button 
        className="w-full mb-1.5 md:mb-10 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-sm md:text-xl py-1 md:py-7 rounded-lg"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex flex-col items-center gap-1.5 md:gap-8">
        <div className="flex items-center gap-1.5 md:gap-6 w-full">
          <BpmSelector bpm={bpm} onBpmChange={handleBpmChange} />
          <MetronomeIndicator isActive={indicator} />
        </div>

        <div className="w-full max-w-[280px]">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>
      
      {isPlaying && (
        <div className="text-center mt-1 md:mt-8 text-xs md:text-xl font-medium text-[#1A1F2C]">
          Points: {currentPoints}
        </div>
      )}
    </div>
  );
};

export default MetronomeControl;