import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
  } = useMetronome(onPointsUpdate, onPracticeTimeUpdate);

  return (
    <Card className="p-6 shadow-lg max-w-md mx-auto">
      <Button 
        className="w-full mb-4 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-xl py-6"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <BpmSelector bpm={bpm} onBpmChange={handleBpmChange} />
          <MetronomeIndicator isActive={indicator} />
        </div>

        <div className="w-full md:w-auto">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>
    </Card>
  );
};

export default MetronomeControl;