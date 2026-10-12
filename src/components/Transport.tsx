import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  fastestStepDelayMs,
  slowestStepDelayMs,
  type Playback,
} from "@/hooks/usePlayback";

interface TransportProps {
  playback: Playback;
  onShuffle: () => void;
}

export function Transport({ playback, onShuffle }: TransportProps) {
  const { isPlaying, isAtFirstStep, isAtLastStep, stepDelayMs } = playback;
  const delayRange = slowestStepDelayMs - fastestStepDelayMs;
  const sliderFill = `${((stepDelayMs - fastestStepDelayMs) / delayRange) * 100}%`;

  return (
    <div className="flex flex-wrap items-center gap-2.5 border-t border-border px-4 py-4 sm:px-6">
      <IconButton label="Shuffle input" onClick={onShuffle}>
        <Shuffle className="size-4" />
      </IconButton>
      <IconButton label="Restart" onClick={playback.restart}>
        <RotateCcw className="size-4" />
      </IconButton>

      <div className="ml-auto flex items-center gap-2">
        <IconButton
          label="First step"
          onClick={playback.goToFirstStep}
          disabled={isAtFirstStep}
        >
          <SkipBack className="size-4" />
        </IconButton>
        <IconButton
          label="Previous step"
          onClick={playback.stepBackward}
          disabled={isAtFirstStep}
        >
          <ChevronLeft className="size-4" />
        </IconButton>
        <button
          type="button"
          onClick={playback.togglePlayback}
          className="flex h-9 w-25 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent text-ui font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          {isPlaying ? (
            <Pause aria-hidden="true" className="size-3.5 fill-current" />
          ) : (
            <Play aria-hidden="true" className="size-3.5 fill-current" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <IconButton
          label="Next step"
          onClick={playback.stepForward}
          disabled={isAtLastStep}
        >
          <ChevronRight className="size-4" />
        </IconButton>
        <IconButton
          label="Last step"
          onClick={playback.goToLastStep}
          disabled={isAtLastStep}
        >
          <SkipForward className="size-4" />
        </IconButton>
      </div>

      <label className="ml-auto flex items-center gap-2.5 font-mono text-meta text-tertiary">
        speed
        <input
          type="range"
          min={fastestStepDelayMs}
          max={slowestStepDelayMs}
          step={50}
          value={stepDelayMs}
          onChange={(event) => {
            playback.setStepDelayMs(event.target.valueAsNumber);
          }}
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${sliderFill}, var(--color-border-strong) ${sliderFill})`,
          }}
          className="slider-thumb h-1 w-35 cursor-pointer appearance-none rounded-xs"
        />
        <output className="w-13 text-right tabular-nums">
          {stepDelayMs}ms
        </output>
      </label>
    </div>
  );
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

function IconButton({
  label,
  onClick,
  disabled = false,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="icon-button"
    >
      {children}
    </button>
  );
}
