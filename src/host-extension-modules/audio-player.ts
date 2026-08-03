export function createAudioPlayer() {
  const audioContext = new AudioContext();

  const state: {
    playing: boolean;
    audioSource: AudioBufferSourceNode | null;
    loop: boolean;
  } = {
    playing: false,
    audioSource: null,
    loop: false,
  };

  return {
    play(buffer: AudioBuffer, endedCallback?: () => void) {
      if (!state.playing) {
        const audioSource = new AudioBufferSourceNode(audioContext);
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
        audioSource.onended = () => {
          state.playing = false;
          endedCallback?.();
        };
        audioSource.loop = state.loop;
        state.playing = true;
        state.audioSource = audioSource;
      }
    },
    setLoop(loop: boolean) {
      state.loop = loop;
      if (state.audioSource) {
        state.audioSource.loop = loop;
      }
    },
    stop() {
      if (state.playing) {
        state.audioSource?.stop();
        state.audioSource = null;
        state.playing = false;
      }
    },
  };
}

export const audioPlayer = createAudioPlayer();
