import { describe, expect, it } from "vitest";
import { neighborsOf, type Graph } from "./graph";
import { createRandomConnectedGraph } from "./randomGraph";

function reachableFrom(graph: Graph, startNode: string): Set<string> {
  const reachedNodes = new Set([startNode]);

  for (const node of reachedNodes) {
    for (const neighbor of neighborsOf(graph, node)) {
      reachedNodes.add(neighbor);
    }
  }

  return reachedNodes;
}

describe("createRandomConnectedGraph", () => {
  const graphs = Array.from({ length: 50 }, createRandomConnectedGraph);

  it("connects every node to the first one", () => {
    for (const graph of graphs) {
      expect(reachableFrom(graph, graph.nodes[0]).size).toBe(
        graph.nodes.length,
      );
    }
  });

  it("never links a node to itself", () => {
    for (const graph of graphs) {
      for (const [firstNode, secondNode] of graph.edges) {
        expect(firstNode).not.toBe(secondNode);
      }
    }
  });

  it("never repeats an edge", () => {
    for (const graph of graphs) {
      const edgeKeys = graph.edges.map((edge) => edge.toSorted().join("-"));

      expect(new Set(edgeKeys).size).toBe(edgeKeys.length);
    }
  });
});
