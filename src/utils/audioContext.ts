export const getMicrophoneFrquency = (
  stream: MediaStream,
  setState: (value: number) => void
): void => {
  if (!stream.getAudioTracks().length) return;

  const audioContext = new AudioContext();
  const src = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  src.connect(analyser);
  analyser.connect(scriptProcessor);
  scriptProcessor.connect(audioContext.destination);
  scriptProcessor.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    const arraySum = array.reduce((a, value) => a + value, 0);
    const average = arraySum / array.length;
    const level = Math.round(average);
    // eslint-disable-next-line no-nested-ternary
    setState(level > 5 ? (level - 5 >= 3 ? 3 : level - 5) : 0);
  };
};
