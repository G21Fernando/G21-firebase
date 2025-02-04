import React from 'react';
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const handleChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  return (
    <div className="w-full">
      <Slider
        defaultValue={[volume]}
        max={1}
        step={0.1}
        onValueChange={handleChange}
      />
    </div>
  );
};

export default VolumeControl;