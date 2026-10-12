export interface Point {
  x: number;
  y: number;
}

const padding = 48;
const minimumWidth = 640;
const minimumHeight = 320;

export function fitViewBox(points: readonly Point[]): string {
  if (points.length === 0) return `0 0 ${minimumWidth} ${minimumHeight}`;

  const horizontalPositions = points.map((point) => point.x);
  const verticalPositions = points.map((point) => point.y);
  const left = Math.min(...horizontalPositions);
  const right = Math.max(...horizontalPositions);
  const top = Math.min(...verticalPositions);
  const bottom = Math.max(...verticalPositions);

  const width = Math.max(minimumWidth, right - left + 2 * padding);
  const height = Math.max(minimumHeight, bottom - top + 2 * padding);
  const horizontalCenter = (left + right) / 2;

  return [horizontalCenter - width / 2, top - padding, width, height].join(" ");
}
