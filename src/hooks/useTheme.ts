import { useLayoutEffect, useState } from "react";
import { readStoredValue, storeValue } from "@/lib/storage";

export type Theme = "light" | "dark";

const storageKey = "ipc:theme";

function readInitialTheme(): Theme {
  const storedTheme = readStoredValue(storageKey);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme(): void {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    storeValue(storageKey, nextTheme);
  }

  return { theme, toggleTheme };
}
