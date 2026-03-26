import { Audio } from "expo-av";

const SOUND_FILES = {
  correct: require("../assets/sounds/correct.wav"),
  wrong: require("../assets/sounds/wrong.wav"),
  complete: require("../assets/sounds/complete.wav"),
  tap: require("../assets/sounds/tap.wav"),
};

type SoundName = keyof typeof SOUND_FILES;

const loadedSounds: Partial<Record<SoundName, Audio.Sound>> = {};

export async function preloadSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    for (const [name, source] of Object.entries(SOUND_FILES)) {
      const { sound } = await Audio.Sound.createAsync(source);
      loadedSounds[name as SoundName] = sound;
    }
  } catch {
    // Sounds are not critical — fail silently
  }
}

export async function playSound(name: SoundName) {
  try {
    const sound = loadedSounds[name];
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch {
    // fail silently
  }
}
