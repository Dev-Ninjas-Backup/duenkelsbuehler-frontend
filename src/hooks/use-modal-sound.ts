import { useEffect } from "react";

export function playKaChingSound(soundPath: string = "/sounds/ka-ching.mp3") {
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Browsers may block un-interacted audio playback
    });
  } catch (e) {
    console.warn("Audio playback exception:", e);
  }
}

export function useModalSound(isOpen: boolean, soundPath: string = "/sounds/ka-ching.mp3") {
  useEffect(() => {
    if (!isOpen) return;
    playKaChingSound(soundPath);
  }, [isOpen, soundPath]);
}
