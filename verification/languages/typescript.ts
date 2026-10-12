import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import ts from "typescript";
import { neighborsOf } from "@/structures/graph/graph";
import prelude from "../preludes/typescript.txt?raw";
import { runCommand, withTemporaryDirectory } from "../process";
import type { Argument, ResultKind } from "../verification";
import { writeCalls, type LanguageAdapter } from "./adapter";

const compilerOptions: ts.CompilerOptions = {
  strict: true,
  target: ts.ScriptTarget.ES2023,
  lib: ["lib.es2023.d.ts"],
  types: [],
};

const diagnosticsHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => "",
  getNewLine: () => "\n",
};

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return JSON.stringify(argument.values);
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `buildTree(${JSON.stringify(argument.values)})`;
    case "graph": {
      const adjacency = argument.graph.nodes.map((node) => [
        node,
        neighborsOf(argument.graph, node),
      ]);

      return `{ edges: new Map(${JSON.stringify(adjacency)}) }`;
    }
  }
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `listInOrder(${call})` : call;
}

export const typescriptAdapter: LanguageAdapter = {
  entryPointPattern: /function\s+(\w+)\s*\(/,

  findToolchainVersion: () => Promise.resolve(ts.version),

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `console.log(JSON.stringify(${result}));`;
    });

    return [prelude, snippetCode, ...outputStatements].join("\n\n");
  },

  run(program) {
    return withTemporaryDirectory(async (directory) => {
      const sourceFile = join(directory, "program.ts");
      await writeFile(sourceFile, program);

      const compilation = ts.createProgram([sourceFile], {
        ...compilerOptions,
        outDir: directory,
      });
      const diagnostics = ts.getPreEmitDiagnostics(compilation);
      if (diagnostics.length > 0) {
        throw new Error(ts.formatDiagnostics(diagnostics, diagnosticsHost));
      }
      compilation.emit();

      return runCommand(process.execPath, [join(directory, "program.js")]);
    });
  },
};
