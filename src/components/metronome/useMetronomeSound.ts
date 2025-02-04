export const useMetronomeSound = (volume: number) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playClick = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.value = volume;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return { playClick };
};