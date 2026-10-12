import type { LanguageId } from "@/algorithms/languages";
import type { LanguageAdapter } from "./adapter";
import { goAdapter } from "./go";
import { pythonAdapter } from "./python";
import { typescriptAdapter } from "./typescript";

export const adapters: Record<LanguageId, LanguageAdapter> = {
  typescript: typescriptAdapter,
  python: pythonAdapter,
  go: goAdapter,
};
