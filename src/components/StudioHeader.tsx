import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import type { Algorithm } from "@/algorithms/algorithm";
import { categoryNames } from "@/algorithms/categories";

interface StudioHeaderProps {
  algorithm: Algorithm;
  onOpenNavigation: () => void;
  children: ReactNode;
}

export function StudioHeader({
  algorithm,
  onOpenNavigation,
  children,
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
      {children}
    </header>
  );
}
