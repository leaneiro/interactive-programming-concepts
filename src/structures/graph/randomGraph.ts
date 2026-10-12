import { pickRandom, randomInteger } from "@/lib/random";
import { connects, type Graph, type GraphEdge } from "./graph";

const nodeNames = ["A", "B", "C", "D", "E", "F", "G"];
const smallestNodeCount = 5;

export function createRandomConnectedGraph(): Graph {
  const nodeCount = randomInteger(smallestNodeCount, nodeNames.length);
  const nodes = nodeNames.slice(0, nodeCount);
  const edges: GraphEdge[] = [];

  for (let nodeIndex = 1; nodeIndex < nodes.length; nodeIndex++) {
    const earlierNode = nodes[randomInteger(0, nodeIndex - 1)];
    edges.push([earlierNode, nodes[nodeIndex]]);
  }

  const extraEdgeAttempts = randomInteger(1, 3);
  for (let attempt = 0; attempt < extraEdgeAttempts; attempt++) {
    const firstNode = pickRandom(nodes);
    const secondNode = pickRandom(nodes);
    const isNewEdge =
      firstNode !== secondNode &&
      !edges.some((edge) => connects(edge, firstNode, secondNode));

    if (isNewEdge) edges.push([firstNode, secondNode]);
  }

  return { nodes, edges };
}
