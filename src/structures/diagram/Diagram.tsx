import type { ReactNode } from "react";
import { fitViewBox, nodeRadius, type Point } from "./geometry";

const cellCornerRadius = 6;
const captionGap = 14;
const arrowLength = 8;
const arrowHalfWidth = 5;

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

interface DiagramArcProps {
  start: Point;
  end: Point;
  height: number;
  isHighlighted: boolean;
}

export function DiagramArc({
  start,
  end,
  height,
  isHighlighted,
}: DiagramArcProps) {
  const arrowBase = end.y - arrowLength;
  const curve = `M ${start.x} ${start.y} C ${start.x} ${start.y - height}, ${end.x} ${start.y - height}, ${end.x} ${arrowBase}`;
  const arrowhead = `M ${end.x - arrowHalfWidth} ${arrowBase} L ${end.x + arrowHalfWidth} ${arrowBase} L ${end.x} ${end.y} Z`;

  return (
    <g data-highlighted={isHighlighted} className="group">
      <path
        d={curve}
        fill="none"
        strokeLinecap="round"
        className="stroke-border-strong stroke-2 transition-colors duration-200 group-data-[highlighted=true]:stroke-accent group-data-[highlighted=true]:stroke-3"
      />
      <path
        d={arrowhead}
        className="fill-border-strong transition-colors duration-200 group-data-[highlighted=true]:fill-accent"
      />
    </g>
  );
}

interface DiagramCellProps {
  position: Point;
  label: string;
  caption: string;
  tone: NodeTone;
}

export function DiagramCell({
  position,
  label,
  caption,
  tone,
}: DiagramCellProps) {
  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      <rect
        x={-nodeRadius}
        y={-nodeRadius}
        width={2 * nodeRadius}
        height={2 * nodeRadius}
        rx={cellCornerRadius}
        className={`${toneClassNames[tone]} stroke-surface stroke-3 transition-colors duration-200`}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-surface font-mono text-body font-medium select-none"
      >
        {label}
      </text>
      <text
        y={nodeRadius + captionGap}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-faded font-mono text-label select-none"
      >
        {caption}
      </text>
    </g>
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
