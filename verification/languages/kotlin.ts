import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/kotlin.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument, ResultKind } from "../verification";
import {
  listAdjacency,
  quoteAll,
  writeCalls,
  type LanguageAdapter,
} from "./adapter";

const compiler = "kotlinc";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `intArrayOf(${argument.values.join(", ")})`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree(${argument.values.join(", ")})`;
    case "graph": {
      const entries = listAdjacency(argument.graph).map(
        ([node, neighbors]) =>
          `${JSON.stringify(node)} to listOf<String>(${quoteAll(neighbors)})`,
      );

      return `mapOf(${entries.join(", ")})`;
    }
    case "pairs": {
      const entries = argument.pairs.map(
        ([first, second]) => `${first} to ${second}`,
      );

      return `listOf<Pair<Int, Int>>(${entries.join(", ")})`;
    }
  }
}

function writeOutput(resultKind: ResultKind, call: string): string {
  switch (resultKind) {
    case "integers":
      return `println(${call}.contentToString())`;
    case "index":
    case "boolean":
      return `println(${call})`;
    case "treeInOrder":
      return `println(listInOrder(${call}))`;
    case "texts":
      return `println(quoteAll(${call}))`;
  }
}

export const kotlinAdapter: LanguageAdapter = {
  entryPointPattern: /fun\s+(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion(compiler, ["-version"], /kotlinc-jvm (\d+(?:\.\d+)+)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => `    ${writeOutput(verification.resultKind, call)}`);
    const mainFunction = ["fun main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.kt"), program);
      await runCommand(
        compiler,
        ["main.kt", "-include-runtime", "-d", "program.jar"],
        directory,
      );

      return runCommand("java", ["-jar", "program.jar"], directory);
    });
  },
};
