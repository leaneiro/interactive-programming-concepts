import { nodeRadius, type Point } from "../diagram/geometry";

const cellPitch = 52;
const shortestArcHeight = 24;
const arcHeightPerCell = 10;
const arrivalOffset = 9;
const captionSpace = 28;
const arcPeakRatio = 0.75;

export interface PositionedArrayCell extends Point {
  element: number;
}

export interface ParentArc {
  element: number;
  start: Point;
  end: Point;
  height: number;
}

export interface ParentArrayLayout {
  cells: PositionedArrayCell[];
  arcs: ParentArc[];
  outline: Point[];
}

function arcHeightFor(distance: number): number {
  return shortestArcHeight + distance * arcHeightPerCell;
}

export function layoutParentArray(
  parent: readonly number[],
): ParentArrayLayout {
  const cells = parent.map((_parentElement, element) => ({
    element,
    x: element * cellPitch,
    y: 0,
  }));
  const cellTop = -nodeRadius;

  const arcs = parent.flatMap((parentElement, element): ParentArc[] => {
    if (parentElement === element) return [];

    const direction = Math.sign(parentElement - element);

    return [
      {
        element,
        start: { x: cells[element].x, y: cellTop },
        end: {
          x: cells[parentElement].x - direction * arrivalOffset,
          y: cellTop,
        },
        height: arcHeightFor(Math.abs(parentElement - element)),
      },
    ];
  });

  const tallestArcPeak = arcPeakRatio * arcHeightFor(parent.length - 1);
  const lastCellX = Math.max(0, parent.length - 1) * cellPitch;
  const outline = [
    { x: 0, y: cellTop - tallestArcPeak },
    { x: lastCellX, y: nodeRadius + captionSpace },
  ];

  return { cells, arcs, outline };
}
