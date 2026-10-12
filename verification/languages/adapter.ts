import type { AlgorithmVerification, Argument } from "../verification";

export interface LanguageAdapter {
  entryPointPattern: RegExp;
  findToolchainVersion: () => Promise<string | null>;
  writeProgram: (
    snippetCode: string,
    entryPoint: string,
    verification: AlgorithmVerification,
  ) => string;
  run: (program: string) => Promise<string>;
}

export function writeCalls(
  entryPoint: string,
  verification: AlgorithmVerification,
  renderArgument: (argument: Argument) => string,
): string[] {
  return verification.cases.map((verificationCase) => {
    const renderedArguments = verificationCase.arguments.map(renderArgument);

    return `${entryPoint}(${renderedArguments.join(", ")})`;
  });
}

export function cannotRender(languageName: string, kind: string): never {
  throw new Error(
    `The ${languageName} adapter cannot build a "${kind}" value yet. Teach it in verification/languages before adding this snippet.`,
  );
}
