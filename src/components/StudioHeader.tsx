import { Menu } from "lucide-react";
import type { Algorithm } from "@/algorithms/algorithm";
import { categoryNames } from "@/algorithms/categories";
import { languages, type LanguageId } from "@/algorithms/languages";
import type { Theme } from "@/hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";

interface StudioHeaderProps {
  algorithm: Algorithm;
  languageId: LanguageId;
  theme: Theme;
  onSelectLanguage: (languageId: LanguageId) => void;
  onToggleTheme: () => void;
  onOpenNavigation: () => void;
}

export function StudioHeader({
  algorithm,
  languageId,
  theme,
  onSelectLanguage,
  onToggleTheme,
  onOpenNavigation,
}: StudioHeaderProps) {
  const summary = [
    categoryNames[algorithm.category].toLowerCase(),
    ...algorithm.traits,
    algorithm.complexity,
  ].join(" · ");

  return (
    <header className="flex items-center gap-2 border-b border-border px-3 sm:gap-3.5 sm:px-6">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={onOpenNavigation}
        className="icon-button studio:hidden"
      >
        <Menu aria-hidden="true" className="size-4" />
      </button>
      <h1 className="min-w-0 truncate text-cell font-semibold sm:text-title">
        {algorithm.name}
      </h1>
      <p className="hidden truncate font-mono text-meta text-tertiary md:block">
        {summary}
      </p>

      <div
        role="group"
        aria-label="Language"
        className="ml-auto flex rounded-lg bg-raised p-0.75 text-ui"
      >
        {algorithm.snippets.map((snippet) => (
          <button
            key={snippet.languageId}
            type="button"
            aria-pressed={snippet.languageId === languageId}
            onClick={() => {
              onSelectLanguage(snippet.languageId);
            }}
            className="cursor-pointer rounded-md px-2 py-1.25 text-secondary aria-pressed:bg-selected aria-pressed:font-medium aria-pressed:text-foreground sm:px-3"
          >
            {languages[snippet.languageId].name}
          </button>
        ))}
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
