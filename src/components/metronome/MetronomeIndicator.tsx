import React from 'react';

interface MetronomeIndicatorProps {
  isActive: boolean;
}

const MetronomeIndicator: React.FC<MetronomeIndicatorProps> = ({ isActive }) => {
  return (
    <div 
      className={`w-5 h-5 rounded-full bg-[#1A1F2C] metronome-indicator ${
        isActive ? 'active' : ''
      }`}
    />
  );
};

export default MetronomeIndicator;