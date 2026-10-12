import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { readStoredValue, storeValue } from "@/lib/storage";

interface ResizableWidthOptions {
  storageKey: string;
  initialWidth: number;
  minimumWidth: number;
  maximumWidth: number;
}

interface DragOrigin {
  pointerX: number;
  width: number;
}

const keyboardStep = 16;

export function useResizableWidth({
  storageKey,
  initialWidth,
  minimumWidth,
  maximumWidth,
}: ResizableWidthOptions) {
  const clampWidth = (candidateWidth: number) =>
    Math.min(maximumWidth, Math.max(minimumWidth, candidateWidth));

  const [width, setWidth] = useState(() => {
    const storedWidth = Number(readStoredValue(storageKey));
    return storedWidth > 0 ? clampWidth(storedWidth) : initialWidth;
  });
  const [dragOrigin, setDragOrigin] = useState<DragOrigin | null>(null);

  function resizeWithKeyboard(widthChange: number): void {
    const nextWidth = clampWidth(width + widthChange);
    setWidth(nextWidth);
    storeValue(storageKey, String(nextWidth));
  }

  const separatorProps = {
    role: "separator",
    tabIndex: 0,
    "aria-orientation": "vertical",
    "aria-valuenow": width,
    "aria-valuemin": minimumWidth,
    "aria-valuemax": maximumWidth,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragOrigin({ pointerX: event.clientX, width });
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (dragOrigin === null) return;
      const pointerTravel = dragOrigin.pointerX - event.clientX;
      setWidth(clampWidth(dragOrigin.width + pointerTravel));
    },
    onLostPointerCapture() {
      setDragOrigin(null);
      storeValue(storageKey, String(width));
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      if (event.key === "ArrowLeft") resizeWithKeyboard(keyboardStep);
      if (event.key === "ArrowRight") resizeWithKeyboard(-keyboardStep);
    },
  } as const;

  return { width, separatorProps };
}
