import { Moon, Sun } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-strong text-secondary transition-colors hover:bg-hover"
    >
      {isDark ? (
        <Moon aria-hidden="true" className="size-4" />
      ) : (
        <Sun aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
