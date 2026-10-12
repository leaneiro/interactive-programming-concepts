import type { PointerEvent } from "react";
import type { LineRange, Step } from "@/algorithms/algorithm";
import { RichTextView } from "./RichTextView";

const tallTickInterval = 8;

interface TimelineProps {
  step: Step;
  stepIndex: number;
  stepCount: number;
  regions: Record<string, LineRange>;
  onSeek: (stepIndex: number) => void;
}

export function Timeline({
  step,
  stepIndex,
  stepCount,
  regions,
  onSeek,
}: TimelineProps) {
  function seekToPointer(event: PointerEvent<HTMLDivElement>): void {
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = (event.clientX - bounds.left) / bounds.width;
    onSeek(Math.floor(progress * stepCount));
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4.5 border-b border-border px-4 sm:px-6 @md:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
      <p className="font-mono text-counter font-medium whitespace-nowrap">
        {stepIndex + 1}
        <span className="text-faded"> / {stepCount}</span>
      </p>

      <div
        role="slider"
        tabIndex={-1}
        aria-label="Step"
        aria-valuemin={1}
        aria-valuemax={stepCount}
        aria-valuenow={stepIndex + 1}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekToPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            seekToPointer(event);
          }
        }}
        className="flex h-4.5 cursor-pointer touch-none items-end gap-px"
      >
        {Array.from({ length: stepCount }, (_unused, tickIndex) => (
          <span
            key={tickIndex}
            data-position={describeTickPosition(tickIndex, stepIndex)}
            data-tall={tickIndex % tallTickInterval === 0}
            className="h-1.75 flex-1 rounded-[1px] bg-border-strong data-[position=current]:h-4.5 data-[position=current]:bg-accent data-[position=past]:bg-secondary data-[tall=true]:h-3 data-[position=current]:data-[tall=true]:h-4.5"
          />
        ))}
      </div>

      <dl className="hidden gap-3.5 font-mono text-meta whitespace-nowrap text-tertiary @md:flex">
        {step.counters.map((counter) => (
          <div key={counter.label} className="flex gap-1.5">
            <dd>{counter.value}</dd>
            <dt className="text-ghost">{counter.label}</dt>
          </div>
        ))}
      </dl>

      <p className="hidden text-ui whitespace-nowrap text-foreground/80 @2xl:block">
        <RichTextView text={step.caption} regions={regions} />
      </p>
    </div>
  );
}

function describeTickPosition(tickIndex: number, stepIndex: number): string {
  if (tickIndex === stepIndex) return "current";
  return tickIndex < stepIndex ? "past" : "future";
}
