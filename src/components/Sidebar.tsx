import { useEffect, useEffectEvent, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Algorithm } from "@/algorithms/algorithm";
import { categoryNames } from "@/algorithms/categories";

interface SidebarProps {
  algorithms: readonly Algorithm[];
  selectedAlgorithmId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (algorithm: Algorithm) => void;
}

export function Sidebar({
  algorithms,
  selectedAlgorithmId,
  isOpen,
  onOpen,
  onClose,
  onSelect,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchShortcut = useEffectEvent((event: KeyboardEvent) => {
    const isSearchShortcut =
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (!isSearchShortcut) return;

    event.preventDefault();
    flushSync(onOpen);
    searchInputRef.current?.focus();
  });

  useEffect(() => {
    window.addEventListener("keydown", handleSearchShortcut);

    return () => {
      window.removeEventListener("keydown", handleSearchShortcut);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const groups = Object.entries(categoryNames)
    .map(([categoryId, categoryName]) => ({
      categoryName,
      algorithms: algorithms.filter(
        (algorithm) =>
          algorithm.category === categoryId &&
          algorithm.name.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.algorithms.length > 0);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-10 bg-scrim studio:hidden"
        />
      )}
      <aside
        data-open={isOpen}
        className="invisible fixed inset-y-0 left-0 z-20 flex w-58 -translate-x-full flex-col gap-4.5 overflow-y-auto border-r border-border bg-sunken px-3.5 py-5 transition-[translate,visibility] duration-200 data-[open=true]:visible data-[open=true]:translate-x-0 studio:visible studio:static studio:translate-x-0"
      >
        <div className="flex items-center gap-2.5 px-2">
          <span className="size-5.5 rounded-md bg-accent" />
          <span className="font-mono text-cell font-medium">algo.lab</span>
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-border-strong bg-chip px-2.5 py-2 text-ui text-tertiary focus-within:border-accent">
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search algorithms…"
            aria-label="Search algorithms"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-tertiary"
          />
          <kbd className="rounded-sm border border-border-strong px-1.25 py-px font-mono text-label">
            ⌘K
          </kbd>
        </label>

        <nav className="flex flex-col gap-4 text-nav">
          {groups.map((group) => (
            <div key={group.categoryName} className="flex flex-col gap-0.5">
              <h2 className="px-2 pb-1.5 section-label">
                {group.categoryName}
              </h2>
              {group.algorithms.map((algorithm) => {
                const isSelected = algorithm.id === selectedAlgorithmId;

                return (
                  <button
                    key={algorithm.id}
                    type="button"
                    aria-current={isSelected ? "page" : undefined}
                    onClick={() => {
                      onSelect(algorithm);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-[7px] px-2.5 py-1.75 text-left text-secondary hover:bg-hover aria-[current=page]:bg-accent-tint aria-[current=page]:font-medium aria-[current=page]:text-accent-text"
                  >
                    {algorithm.name}
                    {isSelected && (
                      <span className="font-mono text-label">
                        {algorithm.complexity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {groups.length === 0 && (
            <p className="px-2 text-tertiary">No algorithm matches.</p>
          )}
        </nav>
      </aside>
    </>
  );
}
