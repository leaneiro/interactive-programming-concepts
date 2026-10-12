import { beforeAll, describe, expect, it } from "vitest";
import { algorithms } from "@/algorithms";
import { languageIds, languages } from "@/algorithms/languages";
import { verifications } from "./cases";
import { adapters } from "./languages";
import { describeArgument, type VerificationCase } from "./verification";

const mustRunEveryLanguage = process.env.REQUIRE_ALL_TOOLCHAINS === "true";

beforeAll(async () => {
  const toolchains = await Promise.all(
    languageIds.map(async (languageId) => {
      const version = await adapters[languageId].findToolchainVersion();

      return `${languages[languageId].name} ${version ?? "not installed"}`;
    }),
  );

  console.info(`Toolchains: ${toolchains.join(" · ")}`);
});

describe.each(algorithms)("$name", (algorithm) => {
  it.for(algorithm.snippets)(
    "$languageId snippet returns the right results",
    async (snippet, { skip }) => {
      const languageName = languages[snippet.languageId].name;
      const adapter = adapters[snippet.languageId];
      const verification = verifications.get(algorithm.id);

      if (verification === undefined) {
        throw new Error(
          `${algorithm.name} has no cases in verification/cases.ts`,
        );
      }

      const toolchainVersion = await adapter.findToolchainVersion();
      if (toolchainVersion === null) {
        if (mustRunEveryLanguage) {
          throw new Error(`${languageName} is required but not installed`);
        }
        skip(`${languageName} is not installed on this machine`);
      }

      const entryPoint = adapter.entryPointPattern.exec(snippet.code)?.[1];
      if (entryPoint === undefined) {
        throw new Error(`No function found in the ${languageName} snippet`);
      }

      const program = adapter.writeProgram(
        snippet.code,
        entryPoint,
        verification,
      );
      const output = await adapter.run(program).catch((error: unknown) => {
        throw new Error(
          `The ${languageName} program failed.\n\n${String(error)}\n\n${numberLines(program)}`,
        );
      });
      const results = output
        .trim()
        .split("\n")
        .map((outputLine) => JSON.parse(outputLine) as unknown);
      const describeCall = (verificationCase: VerificationCase) =>
        `${entryPoint}(${verificationCase.arguments.map(describeArgument).join(", ")})`;

      expect(
        Object.fromEntries(
          verification.cases.map((verificationCase, caseIndex) => [
            describeCall(verificationCase),
            results[caseIndex],
          ]),
        ),
      ).toEqual(
        Object.fromEntries(
          verification.cases.map((verificationCase) => [
            describeCall(verificationCase),
            verificationCase.expected,
          ]),
        ),
      );
    },
  );
});

function numberLines(program: string): string {
  const programLines = program.split("\n");
  const numberWidth = String(programLines.length).length;

  return programLines
    .map(
      (programLine, lineIndex) =>
        `${String(lineIndex + 1).padStart(numberWidth)} | ${programLine}`,
    )
    .join("\n");
}
