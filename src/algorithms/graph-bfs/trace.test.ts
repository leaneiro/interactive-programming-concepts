import { describe, expect, it } from "vitest";
import type { Graph } from "@/structures/graph/graph";
import { traceBreadthFirstSearch } from "./trace";

const graph: Graph = {
  nodes: ["A", "B", "C", "D", "E"],
  edges: [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "D"],
    ["D", "E"],
  ],
};

describe("traceBreadthFirstSearch", () => {
  const steps = traceBreadthFirstSearch({ graph, startNode: "A" });

  it("visits nodes level by level", () => {
    expect(steps.at(-1)?.state.visitOrder).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("finishes with every node visited and nothing queued", () => {
    const finalState = steps.at(-1)?.state;

    expect(finalState?.visitedNodes).toEqual(graph.nodes);
    expect(finalState?.queuedNodes).toEqual([]);
    expect(finalState?.currentNode).toBeNull();
  });

  it("never queues the same node twice", () => {
    const enqueuedNodes = steps
      .filter((step) => step.region === "enqueue")
      .map((step) => step.historyEntry);

    expect(new Set(enqueuedNodes).size).toBe(enqueuedNodes.length);
    expect(enqueuedNodes).toHaveLength(graph.nodes.length - 1);
  });

  it("only reaches nodes connected to the start", () => {
    const disconnectedGraph: Graph = {
      nodes: ["A", "B", "C"],
      edges: [["A", "B"]],
    };
    const finalState = traceBreadthFirstSearch({
      graph: disconnectedGraph,
      startNode: "A",
    }).at(-1)?.state;

    expect(finalState?.visitedNodes).toEqual(["A", "B"]);
  });
});
