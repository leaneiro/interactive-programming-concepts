import { useEffect, useEffectEvent } from "react";
import type { Playback } from "./usePlayback";

export function usePlaybackShortcuts(playback: Playback): void {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const { target } = event;
    const isTypingTarget =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;
    if (isTypingTarget) return;

    const shortcuts: Record<string, () => void> = {
      ArrowRight: playback.stepForward,
      ArrowLeft: playback.stepBackward,
      Home: playback.goToFirstStep,
      End: playback.goToLastStep,
    };
    if (!(target instanceof HTMLButtonElement)) {
      shortcuts[" "] = playback.togglePlayback;
    }

    if (!Object.hasOwn(shortcuts, event.key)) return;

    event.preventDefault();
    shortcuts[event.key]();
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
