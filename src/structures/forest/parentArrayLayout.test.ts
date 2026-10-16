import { describe, expect, it } from "vitest";
import { layoutParentArray } from "./parentArrayLayout";

describe("layoutParentArray", () => {
  it("places one cell per element, left to right on a single row", () => {
    const { cells } = layoutParentArray([0, 0, 1]);

    expect(cells.map((cell) => cell.element)).toEqual([0, 1, 2]);
    expect(cells.map((cell) => cell.y)).toEqual([0, 0, 0]);
    expect(cells[0].x).toBeLessThan(cells[1].x);
    expect(cells[1].x).toBeLessThan(cells[2].x);
  });

  it("draws an arc from every element that is not a root to its parent", () => {
    const { arcs } = layoutParentArray([0, 0, 2, 2]);

    expect(arcs.map((arc) => arc.element)).toEqual([1, 3]);
  });

  it("lands each arc beside its parent, on the side it comes from", () => {
    const { cells, arcs } = layoutParentArray([1, 1, 1]);
    const [fromLeft, fromRight] = arcs;

    expect(fromLeft.start.x).toBe(cells[0].x);
    expect(fromLeft.end.x).toBeLessThan(cells[1].x);
    expect(fromRight.start.x).toBe(cells[2].x);
    expect(fromRight.end.x).toBeGreaterThan(cells[1].x);
  });

  it("draws longer jumps as taller arcs", () => {
    const { arcs } = layoutParentArray([0, 0, 2, 0]);
    const [shortJump, longJump] = arcs;

    expect(longJump.height).toBeGreaterThan(shortJump.height);
  });

  it("keeps the same frame whatever the links are", () => {
    const separateRoots = layoutParentArray([0, 1, 2, 3]);
    const singleChain = layoutParentArray([3, 0, 1, 3]);

    expect(singleChain.outline).toEqual(separateRoots.outline);
  });
});
