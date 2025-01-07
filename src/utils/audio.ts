export const playEndSound = () => {
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  // Function to create a beep
  const createBeep = (startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    oscillator.connect(gainNode);
    oscillator.type = 'sine';
    oscillator.frequency.value = 329.63; // E4 note frequency

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    return oscillator;
  };

  // Set initial volume
  gainNode.gain.value = 0.5;

  // Create three beeps
  createBeep(0, 0.2); // First beep
  createBeep(0.4, 0.2); // Second beep
  createBeep(0.8, 2.0); // Third beep, lasting 2 seconds

  // Fade out the last beep
  gainNode.gain.setValueAtTime(0.5, 2.6);
  gainNode.gain.linearRampToValueAtTime(0, 3.0);

  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, 3100);
};