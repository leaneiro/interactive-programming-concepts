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

    it("produces traces whose steps all point at a known region", () => {
      for (let attempt = 0; attempt < 25; attempt++) {
        const steps = algorithm.createTrace();

        expect(steps.length).toBeGreaterThan(1);
        for (const step of steps) {
          for (const snippet of algorithm.snippets) {
            expect(snippet.regions).toHaveProperty(step.region);
          }
        }
      }
    });
  });
});
