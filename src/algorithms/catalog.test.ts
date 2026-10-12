import { describe, expect, it } from "vitest";
import { algorithms } from ".";

describe("algorithm catalog", () => {
  it("gives every algorithm a unique id", () => {
    const ids = algorithms.map((algorithm) => algorithm.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(algorithms)("$name", (algorithm) => {
    it("offers each language at most once", () => {
      const languageIds = algorithm.snippets.map(
        (snippet) => snippet.languageId,
      );

      expect(new Set(languageIds).size).toBe(languageIds.length);
    });

    it("maps every region to non-blank lines of each snippet", () => {
      for (const snippet of algorithm.snippets) {
        const codeLines = snippet.code.split("\n");

        for (const [region, range] of Object.entries(snippet.regions)) {
          const description = `${snippet.languageId} region "${region}"`;

          expect(range.firstLine, description).toBeGreaterThanOrEqual(1);
          expect(range.lastLine, description).toBeGreaterThanOrEqual(
            range.firstLine,
          );
          expect(range.lastLine, description).toBeLessThanOrEqual(
            codeLines.length,
          );
          expect(codeLines[range.firstLine - 1].trim(), description).not.toBe(
            "",
          );
          expect(codeLines[range.lastLine - 1].trim(), description).not.toBe(
            "",
          );
        }
      }
    });

    it("produces traces whose steps only use regions and variables every snippet knows", () => {
      for (let attempt = 0; attempt < 25; attempt++) {
        const steps = algorithm.createTrace();

        expect(steps.length).toBeGreaterThan(1);
        for (const step of steps) {
          const referencedRegions = [
            step.region,
            ...[...step.caption, ...step.explanation].flatMap((part) =>
              typeof part !== "string" && part.kind === "lines"
                ? [part.region]
                : [],
            ),
          ];

          for (const snippet of algorithm.snippets) {
            for (const region of referencedRegions) {
              expect(snippet.regions).toHaveProperty(region);
            }
            for (const variableId of Object.keys(snippet.variableNames)) {
              expect(step.variables).toHaveProperty(variableId);
            }
          }
          for (const variableId of step.activeVariables) {
            expect(step.variables).toHaveProperty(variableId);
          }
          expect(step.historyEntry).not.toBe("");
          expect(step.caption.length).toBeGreaterThan(0);
          expect(step.explanation.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
