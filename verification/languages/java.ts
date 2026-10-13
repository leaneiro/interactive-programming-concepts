import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/java.txt?raw";
import {
  findCommandVersion,
  runCommand,
  withTemporaryDirectory,
} from "../process";
import type { Argument, ResultKind } from "../verification";
import { cannotHandle, writeCalls, type LanguageAdapter } from "./adapter";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `new int[] {${argument.values.join(", ")}}`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree(${argument.values.join(", ")})`;
    case "graph":
      return cannotHandle("Java", argument.kind);
  }
}

function writeOutput(resultKind: ResultKind, call: string): string {
  switch (resultKind) {
    case "integers":
      return `System.out.println(Arrays.toString(${call}));`;
    case "boolean":
      return `System.out.println(${call});`;
    case "texts":
    case "treeInOrder":
      return cannotHandle("Java", resultKind);
  }
}

export const javaAdapter: LanguageAdapter = {
  entryPointPattern: /(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion("java", ["--version"], /(\d+(?:\.\d+)*)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      `program.${entryPoint}`,
      verification,
      renderArgument,
    ).map((call) => `        ${writeOutput(verification.resultKind, call)}`);
    const mainMethod = [
      "    public static void main(String[] commandLineArguments) {",
      "        Main program = new Main();",
      ...outputStatements,
      "    }",
      "}",
    ].join("\n");

    return [prelude, snippetCode, mainMethod].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "Main.java"), program);

      return runCommand("java", ["Main.java"], directory);
    });
  },
};
