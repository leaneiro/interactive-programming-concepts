import { ArrayView } from "./array/ArrayView";
import { ForestView } from "./forest/ForestView";
import { GraphView } from "./graph/GraphView";
import { TreeView } from "./tree/TreeView";
import type { VisualState } from "./visualState";

interface StructureViewProps {
  state: VisualState;
}

export function StructureView({ state }: StructureViewProps) {
  switch (state.kind) {
    case "array":
      return <ArrayView state={state} />;
    case "tree":
      return <TreeView state={state} />;
    case "graph":
      return <GraphView state={state} />;
    case "forest":
      return <ForestView state={state} />;
  }
}
