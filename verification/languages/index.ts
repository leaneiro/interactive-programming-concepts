import type { LanguageId } from "@/algorithms/languages";
import type { LanguageAdapter } from "./adapter";
import { cppAdapter } from "./cpp";
import { goAdapter } from "./go";
import { javaAdapter } from "./java";
import { pythonAdapter } from "./python";
import { typescriptAdapter } from "./typescript";

export const adapters: Record<LanguageId, LanguageAdapter> = {
  typescript: typescriptAdapter,
  python: pythonAdapter,
  java: javaAdapter,
  cpp: cppAdapter,
  go: goAdapter,
};
