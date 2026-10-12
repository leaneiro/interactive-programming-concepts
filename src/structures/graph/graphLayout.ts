import type { Point } from "../diagram/geometry";
import type { Graph } from "./graph";

const circleRadius = 140;

export interface PositionedGraphNode extends Point {
  name: string;
}

export interface PositionedGraphEdge {
  firstNode: PositionedGraphNode;
  secondNode: PositionedGraphNode;
}

export interface GraphLayout {
  nodes: PositionedGraphNode[];
  edges: PositionedGraphEdge[];
}

export function layoutGraph(graph: Graph): GraphLayout {
  const nodes = graph.nodes.map((name, nodeIndex) => {
    const angle = (2 * Math.PI * nodeIndex) / graph.nodes.length - Math.PI / 2;

    return {
      name,
      x: circleRadius * Math.cos(angle),
      y: circleRadius * Math.sin(angle),
    };
  });

  const edges = graph.edges.flatMap(([firstName, secondName]) => {
    const firstNode = nodes.find((node) => node.name === firstName);
    const secondNode = nodes.find((node) => node.name === secondName);

    return firstNode && secondNode ? [{ firstNode, secondNode }] : [];
  });

  return { nodes, edges };
}
