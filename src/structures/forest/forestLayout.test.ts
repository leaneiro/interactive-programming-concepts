import { describe, expect, it } from "vitest";
import { layoutForest } from "./forestLayout";

function positionOf(
  layout: ReturnType<typeof layoutForest>,
  element: number,
): { x: number; y: number } {
  const node = layout.nodes.find((candidate) => candidate.element === element);
  if (node === undefined) throw new Error(`${element} was not placed`);

  return { x: node.x, y: node.y };
}

describe("layoutForest", () => {
  it("places every element exactly once", () => {
    const layout = layoutForest([0, 0, 1, 3, 3, 5]);
    const placedElements = layout.nodes.map((node) => node.element);

    expect(placedElements.toSorted()).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("lines up separate roots on the top row, left to right", () => {
    const layout = layoutForest([0, 1, 2]);
    const roots = [0, 1, 2].map((element) => positionOf(layout, element));

    expect(roots.map((root) => root.y)).toEqual([0, 0, 0]);
    expect(roots[0].x).toBeLessThan(roots[1].x);
    expect(roots[1].x).toBeLessThan(roots[2].x);
    expect(layout.edges).toEqual([]);
  });

  it("puts each child one row below its parent and links them", () => {
    const layout = layoutForest([0, 0, 1]);

    expect(positionOf(layout, 1).y).toBeGreaterThan(positionOf(layout, 0).y);
    expect(positionOf(layout, 2).y).toBeGreaterThan(positionOf(layout, 1).y);
    expect(
      layout.edges.map((edge) => [edge.parent.element, edge.child.element]),
    ).toEqual([
      [1, 2],
      [0, 1],
    ]);
  });

  it("centers a parent above its children", () => {
    const layout = layoutForest([0, 0, 0]);
    const children = [1, 2].map((element) => positionOf(layout, element));

    expect(positionOf(layout, 0).x).toBe((children[0].x + children[1].x) / 2);
  });
});
