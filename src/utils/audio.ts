export const playEndSound = () => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = 329.63; // E4 note frequency

  // Start the sound
  oscillator.start();

  // Set initial volume
  gainNode.gain.value = 0.5;

  // Stop after 4 seconds
  setTimeout(() => {
    // Gradual fade out
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 100);
  }, 4000);
};