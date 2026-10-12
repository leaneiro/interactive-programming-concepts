import type { ReactNode } from "react";
import { fitViewBox, type Point } from "./geometry";

const nodeRadius = 22;

export type NodeTone = "idle" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<NodeTone, string> = {
  idle: "fill-idle",
  accent: "fill-accent",
  success: "fill-success",
  warning: "fill-warning",
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
      preserveAspectRatio="xMidYMin meet"
      className="h-96 w-full"
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
      className={
        isHighlighted
          ? "stroke-accent stroke-4 transition-colors"
          : "stroke-edge stroke-2 transition-colors"
      }
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
        className={`${toneClasses[tone]} stroke-panel stroke-3 drop-shadow-md transition-colors`}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-on-node font-mono text-sm font-semibold select-none"
      >
        {label}
      </text>
    </g>
  );
}
