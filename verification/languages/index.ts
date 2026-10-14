import type { LanguageId } from "@/algorithms/languages";
import type { LanguageAdapter } from "./adapter";
import { cppAdapter } from "./cpp";
import { goAdapter } from "./go";
import { javaAdapter } from "./java";
import { kotlinAdapter } from "./kotlin";
import { pythonAdapter } from "./python";
import { rustAdapter } from "./rust";
import { swiftAdapter } from "./swift";
import { typescriptAdapter } from "./typescript";

export const adapters: Record<LanguageId, LanguageAdapter> = {
  typescript: typescriptAdapter,
  python: pythonAdapter,
  java: javaAdapter,
  cpp: cppAdapter,
  go: goAdapter,
  rust: rustAdapter,
  swift: swiftAdapter,
  kotlin: kotlinAdapter,
};
