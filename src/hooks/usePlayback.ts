import { useEffect, useState } from "react";

export const fastestStepDelayMs = 200;
export const slowestStepDelayMs = 1500;
const initialStepDelayMs = 700;

export type Playback = ReturnType<typeof usePlayback>;

export function usePlayback(stepCount: number) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepDelayMs, setStepDelayMs] = useState(initialStepDelayMs);

  const lastStepIndex = Math.max(0, stepCount - 1);
  const isAtFirstStep = stepIndex === 0;
  const isAtLastStep = stepIndex >= lastStepIndex;

  useEffect(() => {
    if (!isPlaying) return;

    const timeoutId = window.setTimeout(() => {
      const nextStepIndex = Math.min(stepIndex + 1, lastStepIndex);
      setStepIndex(nextStepIndex);
      if (nextStepIndex === lastStepIndex) setIsPlaying(false);
    }, stepDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPlaying, stepIndex, lastStepIndex, stepDelayMs]);

  function togglePlayback(): void {
    if (!isPlaying && isAtLastStep) setStepIndex(0);
    setIsPlaying(!isPlaying);
  }

  function stepForward(): void {
    setStepIndex(Math.min(stepIndex + 1, lastStepIndex));
  }

  function stepBackward(): void {
    setStepIndex(Math.max(stepIndex - 1, 0));
  }

  function restart(): void {
    setIsPlaying(false);
    setStepIndex(0);
  }

  return {
    stepIndex,
    isPlaying,
    isAtFirstStep,
    isAtLastStep,
    stepDelayMs,
    setStepDelayMs,
    togglePlayback,
    stepForward,
    stepBackward,
    restart,
  };
}
