import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/cpp.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument, ResultKind } from "../verification";
import { cannotHandle, writeCalls, type LanguageAdapter } from "./adapter";

const compiler = "g++";
const languageStandard = "-std=c++20";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `vector<int>{${argument.values.join(", ")}}`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree({${argument.values.join(", ")}})`;
    case "graph":
      return cannotHandle("C++", argument.kind);
  }
}

function writeOutput(resultKind: ResultKind, call: string): string {
  switch (resultKind) {
    case "integers":
    case "boolean":
      return `printResult(${call});`;
    case "texts":
    case "treeInOrder":
      return cannotHandle("C++", resultKind);
  }
}

export const cppAdapter: LanguageAdapter = {
  entryPointPattern: /(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion(compiler, ["--version"], /(\d+\.\d+(?:\.\d+)?)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => `    ${writeOutput(verification.resultKind, call)}`);
    const mainFunction = ["int main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.cpp"), program);
      await runCommand(
        compiler,
        [languageStandard, "-o", "program", "main.cpp"],
        directory,
      );

      return runCommand(join(directory, "program"), []);
    });
  },
};
