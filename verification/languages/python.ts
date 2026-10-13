import { loadPyodide, type PyodideInterface } from "pyodide";
import prelude from "../preludes/python.txt?raw";
import type { Argument, ResultKind } from "../verification";
import { listAdjacency, writeCalls, type LanguageAdapter } from "./adapter";

let interpreterLoading: Promise<PyodideInterface> | null = null;

function loadInterpreter(): Promise<PyodideInterface> {
  interpreterLoading ??= loadPyodide();

  return interpreterLoading;
}

function renderArgument(argument: Argument): string {
  switch (argument.kind) {
    case "integers":
      return JSON.stringify(argument.values);
    case "integer":
      return String(argument.value);
    case "text":
      return JSON.stringify(argument.value);
    case "tree":
      return `build_tree(${JSON.stringify(argument.values)})`;
    case "graph":
      return JSON.stringify(Object.fromEntries(listAdjacency(argument.graph)));
  }
}

function readResult(resultKind: ResultKind, call: string): string {
  return resultKind === "treeInOrder" ? `list_in_order(${call})` : call;
}

export const pythonAdapter: LanguageAdapter = {
  entryPointPattern: /def\s+(\w+)\s*\(/,

  async findToolchainVersion() {
    const interpreter = await loadInterpreter();
    const version: unknown = interpreter.runPython(
      "import sys\nsys.version.split()[0]",
    );

    return typeof version === "string" ? version : null;
  },

  writeProgram(snippetCode, entryPoint, verification) {
    const outputStatements = writeCalls(
      entryPoint,
      verification,
      renderArgument,
    ).map((call) => {
      const result = readResult(verification.resultKind, call);

      return `print(json.dumps(${result}))`;
    });

    return [prelude, snippetCode, ...outputStatements].join("\n\n");
  },

  async run(program) {
    const interpreter = await loadInterpreter();
    const outputLines: string[] = [];

    interpreter.setStdout({
      batched: (outputLine) => {
        outputLines.push(outputLine);
      },
    });
    interpreter.runPython(`exec(${JSON.stringify(program)}, {})`);

    return outputLines.join("\n");
  },
};
