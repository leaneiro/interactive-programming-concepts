import type { NodeTone } from "../diagram/Diagram";
import type { ForestState } from "./forestState";

export function toneOfElement(state: ForestState, element: number): NodeTone {
  if (state.focusedElements.includes(element)) return "current";
  if (state.pathElements.includes(element)) return "waiting";
  if (state.parent[element] === element) return "done";
  return "pending";
}

export function isLinkToParentHighlighted(
  state: ForestState,
  element: number,
): boolean {
  return (
    state.focusedElements.includes(element) ||
    state.pathElements.includes(element)
  );
}
