import { describe, expect, it } from "vitest";
import { code, linesOf, rich } from "./richText";

describe("rich", () => {
  it("keeps plain text as a single part", () => {
    expect(rich`array sorted`).toEqual(["array sorted"]);
  });

  it("interleaves text with code and line references", () => {
    expect(
      rich`Compares ${code("a[0]")} with ${code(7)} (${linesOf("compare")}).`,
    ).toEqual([
      "Compares ",
      { kind: "code", text: "a[0]" },
      " with ",
      { kind: "code", text: "7" },
      " (",
      { kind: "lines", region: "compare" },
      ").",
    ]);
  });

  it("writes interpolated numbers as text", () => {
    expect(rich`pass ${2} of ${7}`).toEqual(["pass ", "2", " of ", "7", ""]);
  });
});
