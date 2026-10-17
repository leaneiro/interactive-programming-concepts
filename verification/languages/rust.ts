import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import prelude from "../preludes/rust.txt?raw";
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

const compiler = "rustc";
const edition = "2021";

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return `vec![${argument.values.join(", ")}]`;
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `build_tree(vec![${argument.values.join(", ")}])`;
    case "graph": {
      const entries = listAdjacency(argument.graph).map(
        ([node, neighbors]) =>
          `(${JSON.stringify(node)}, vec![${quoteAll(neighbors)}])`,
      );

      return `build_graph(vec![${entries.join(", ")}])`;
    }
    case "pairs": {
      const entries = argument.pairs.map(
        ([first, second]) => `(${first}, ${second})`,
      );

      return `vec![${entries.join(", ")}]`;
    }
  }
}

function listBorrowedParameters(
  snippetCode: string,
  entryPoint: string,
): boolean[] {
  const signatureStart = snippetCode.indexOf(`fn ${entryPoint}(`);
  const parametersStart = snippetCode.indexOf("(", signatureStart) + 1;
  const parameters = snippetCode.slice(
    parametersStart,
    snippetCode.indexOf(")", parametersStart),
  );

  return parameters
    .split(/,(?![^<]*>)/)
    .map((parameter) => /:\s*&/.test(parameter));
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `list_in_order(&${call})` : call;
}

export const rustAdapter: LanguageAdapter = {
  entryPointPattern: /fn\s+(\w+)\s*\(/,

  findToolchainVersion: () =>
    findCommandVersion(compiler, ["--version"], /(\d+\.\d+\.\d+)/),

  writeProgram(snippetCode, entryPoint, verification) {
    const borrowedParameters = listBorrowedParameters(snippetCode, entryPoint);
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      (argument, position) => {
        const isCollection =
          argument.kind !== "integer" && argument.kind !== "text";
        const borrow = isCollection && borrowedParameters[position] ? "&" : "";

        return `${borrow}${renderArgument(argument)}`;
      },
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `    println!("{:?}", ${result});`;
    });
    const mainFunction = ["fn main() {", ...outputStatements, "}"].join("\n");

    return [prelude, snippetCode, mainFunction].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      await writeFile(join(directory, "main.rs"), program);
      await runCommand(
        compiler,
        ["--edition", edition, "-o", "program", "main.rs"],
        directory,
      );

      return runCommand(join(directory, "program"), []);
    });
  },
};
