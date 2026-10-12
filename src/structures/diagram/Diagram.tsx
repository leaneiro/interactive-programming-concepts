import type { ReactNode } from "react";
import { fitViewBox, type Point } from "./geometry";

const nodeRadius = 22;

export type NodeTone = "pending" | "current" | "done" | "waiting" | "danger";

const toneClassNames: Record<NodeTone, string> = {
  pending: "fill-pending",
  current: "fill-accent",
  done: "fill-sorted",
  waiting: "fill-waiting",
  danger: "fill-danger",
};

interface DiagramProps {
  label: string;
  points: readonly Point[];
  children: ReactNode;
}

export function Diagram({ label, points, children }: DiagramProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={fitViewBox(points)}
      className="size-full"
    >
      {children}
    </svg>
  );
}

interface DiagramEdgeProps {
  from: Point;
  to: Point;
  isHighlighted: boolean;
}

export function DiagramEdge({ from, to, isHighlighted }: DiagramEdgeProps) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      strokeLinecap="round"
      data-highlighted={isHighlighted}
      className="stroke-border-strong stroke-2 transition-colors duration-200 data-[highlighted=true]:stroke-accent data-[highlighted=true]:stroke-3"
    />
  );
}

interface DiagramNodeProps {
  position: Point;
  label: string;
  tone: NodeTone;
}

export function DiagramNode({ position, label, tone }: DiagramNodeProps) {
  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      <circle
        r={nodeRadius}
        className={`${toneClassNames[tone]} stroke-surface stroke-3 transition-colors duration-200`}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-surface font-mono text-body font-medium select-none"
      >
        {label}
      </text>
    </g>
  );
}
