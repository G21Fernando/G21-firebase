import React from 'react';

interface MetronomeIndicatorProps {
  isActive: boolean;
}

const MetronomeIndicator: React.FC<MetronomeIndicatorProps> = ({ isActive }) => {
  return (
    <div 
      className={`w-4 h-4 rounded-full bg-[#1A1F2C] metronome-indicator ${
        isActive ? 'active' : ''
      }`}
    />
  );
};

export default MetronomeIndicator;