import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/go.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument } from "../verification";
import { cannotHandle, writeCalls, type LanguageAdapter } from "./adapter";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `[]int{${argument.values.join(", ")}}`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
    case "graph":
      return cannotHandle("Go", argument.kind);
  }
}

export const goAdapter: LanguageAdapter = {
  entryPointPattern: /func\s+(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion("go", ["version"], /go(\d+(?:\.\d+)+)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => `\tprintResult(${call})`);
    const mainFunction = ["func main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.go"), program);

      return runCommand("go", ["run", "main.go"], directory);
    });
  },
};
