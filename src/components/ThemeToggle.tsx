import { Moon, Sun } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-xs hover:border-accent"
    >
      {isDark ? (
        <Moon aria-hidden="true" className="size-3.5" />
      ) : (
        <Sun aria-hidden="true" className="size-3.5" />
      )}
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
