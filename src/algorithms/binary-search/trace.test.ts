import { describe, expect, it } from "vitest";
import { traceBinarySearch } from "./trace";

const values = [3, 8, 12, 19, 27, 31, 40, 46, 52, 60, 71, 85];

describe("traceBinarySearch", () => {
  it("checks the middle of the range and halves it until it finds the target", () => {
    const steps = traceBinarySearch({ values, target: 46 });
    const lastStep = steps[steps.length - 1];

    expect(steps.map((step) => step.historyEntry)).toEqual([
      "target = 46",
      "low = 0, high = 11",
      "mid = 5",
      "31 < 46 → right",
      "mid = 8",
      "52 > 46 → left",
      "mid = 6",
      "40 < 46 → right",
      "mid = 7",
      "46 = 46 → found",
    ]);
    expect(lastStep.state.outcome).toBe("found");
    expect(lastStep.state.middle).toBe(7);
  });

  it("moves low past the middle when the middle is too small", () => {
    const goRight = traceBinarySearch({ values, target: 46 }).find(
      (step) => step.region === "goRight",
    );

    expect(goRight?.state).toMatchObject({ low: 6, high: 11, middle: 5 });
  });

  it("moves high before the middle when the middle is too large", () => {
    const goLeft = traceBinarySearch({ values, target: 46 }).find(
      (step) => step.region === "goLeft",
    );

    expect(goLeft?.state).toMatchObject({ low: 6, high: 7, middle: 8 });
  });

  it("counts one comparison per middle and shrinks the range each time", () => {
    const steps = traceBinarySearch({ values, target: 46 });
    const countersOf = (region: string) =>
      steps
        .filter((step) => step.region === region)
        .map((step) => step.counters);

    expect(countersOf("middle")).toEqual([
      [
        { label: "cmp", value: 1 },
        { label: "range", value: 12 },
      ],
      [
        { label: "cmp", value: 2 },
        { label: "range", value: 6 },
      ],
      [
        { label: "cmp", value: 3 },
        { label: "range", value: 2 },
      ],
      [
        { label: "cmp", value: 4 },
        { label: "range", value: 1 },
      ],
    ]);
  });

  it("ends with low past high when the target is missing", () => {
    const steps = traceBinarySearch({ values, target: 30 });
    const lastStep = steps[steps.length - 1];

    expect(lastStep.region).toBe("notFound");
    expect(lastStep.state).toMatchObject({
      low: 5,
      high: 4,
      middle: null,
      outcome: "missing",
    });
    expect(lastStep.counters).toContainEqual({ label: "range", value: 0 });
  });

  it("never enters the loop for an empty array", () => {
    const steps = traceBinarySearch({ values: [], target: 4 });

    expect(steps.map((step) => step.region)).toEqual([
      "signature",
      "initialize",
      "notFound",
    ]);
  });
});
