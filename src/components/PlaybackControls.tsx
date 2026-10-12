import {
  Gauge,
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

interface PlaybackControlsProps {
  playback: Playback;
  onRandomize: () => void;
}

export function PlaybackControls({
  playback,
  onRandomize,
}: PlaybackControlsProps) {
  const { isPlaying, stepDelayMs } = playback;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 panel p-4">
      <div className="flex items-center gap-2">
        <IconButton label="Randomize input" onClick={onRandomize}>
          <Shuffle className="size-4.5" />
        </IconButton>
        <IconButton label="Restart" onClick={playback.restart}>
          <RotateCcw className="size-4.5" />
        </IconButton>
      </div>

      <div className="flex items-center gap-1">
        <IconButton
          label="Previous step"
          onClick={playback.stepBackward}
          disabled={isPlaying || playback.isAtFirstStep}
        >
          <SkipBack className="size-4.5" />
        </IconButton>
        <button
          type="button"
          onClick={playback.togglePlayback}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex size-13 cursor-pointer items-center justify-center rounded-full bg-accent text-on-accent shadow-lg transition-transform active:scale-95"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current" />
          )}
        </button>
        <IconButton
          label="Next step"
          onClick={playback.stepForward}
          disabled={isPlaying || playback.isAtLastStep}
        >
          <SkipForward className="size-4.5" />
        </IconButton>
      </div>

      <label className="flex min-w-44 items-center gap-2.5 text-xs text-muted">
        <Gauge aria-hidden="true" className="size-4" />
        <input
          type="range"
          aria-label="Delay between steps"
          min={fastestStepDelayMs}
          max={slowestStepDelayMs}
          step={50}
          value={stepDelayMs}
          onChange={(event) => {
            playback.setStepDelayMs(event.target.valueAsNumber);
          }}
          className="min-w-0 flex-1 cursor-pointer accent-accent"
        />
        <output className="w-12 text-right font-mono tabular-nums">
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
      className="flex size-10 items-center justify-center rounded-full border-2 border-border bg-panel transition enabled:cursor-pointer enabled:hover:border-accent enabled:active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
