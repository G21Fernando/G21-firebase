import React from 'react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Volume</span>
      <Slider
        value={[volume * 100]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-32"
      />
    </div>
  );
};

export default VolumeControl;