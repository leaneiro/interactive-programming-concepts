import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  languageIds,
  languages,
  type LanguageId,
} from "@/algorithms/languages";
import { favoriteLanguageLimit } from "@/hooks/useLanguagePreferences";

interface LanguageSwitchProps {
  favoriteLanguageIds: readonly LanguageId[];
  availableLanguageIds: readonly LanguageId[];
  shownLanguageId: LanguageId;
  onSelect: (languageId: LanguageId) => void;
  onToggleFavorite: (languageId: LanguageId) => void;
}

export function LanguageSwitch({
  favoriteLanguageIds,
  availableLanguageIds,
  shownLanguageId,
  onSelect,
  onToggleFavorite,
}: LanguageSwitchProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function closeOnOutsidePress(event: PointerEvent): void {
      const isInside =
        event.target instanceof Node &&
        containerRef.current?.contains(event.target);
      if (!isInside) setIsMenuOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("pointerdown", closeOnOutsidePress);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("pointerdown", closeOnOutsidePress);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const favoritePills = (
    <FavoritePills
      favoriteLanguageIds={favoriteLanguageIds}
      availableLanguageIds={availableLanguageIds}
      shownLanguageId={shownLanguageId}
      onSelect={onSelect}
    />
  );
  const hasEveryFavorite = favoriteLanguageIds.length === favoriteLanguageLimit;

  return (
    <div ref={containerRef} className="relative ml-auto">
      <div className="flex rounded-lg bg-raised p-0.75 text-ui">
        <div className="hidden sm:flex">{favoritePills}</div>
        <button
          type="button"
          aria-label="Choose favorite languages"
          aria-expanded={isMenuOpen}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.25 text-secondary hover:text-foreground"
        >
          <span className="font-medium text-foreground sm:hidden">
            {languages[shownLanguageId].name}
          </span>
          <ChevronDown aria-hidden="true" className="size-4" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full right-0 z-30 mt-2 flex w-64 flex-col gap-1 rounded-lg border border-border-strong bg-surface p-1.5 shadow-lg">
          <div className="flex rounded-lg bg-raised p-0.75 text-ui sm:hidden">
            {favoritePills}
          </div>

          <p className="flex justify-between px-2 pt-1.5 pb-1 section-label">
            <span>Favorite languages</span>
            <span className="normal-case">
              {favoriteLanguageIds.length} of {favoriteLanguageLimit}
            </span>
          </p>

          <ul>
            {languageIds.map((languageId) => {
              const isFavorite = favoriteLanguageIds.includes(languageId);
              const isLocked = isFavorite
                ? favoriteLanguageIds.length === 1
                : hasEveryFavorite;

              return (
                <li key={languageId}>
                  <label
                    data-locked={isLocked}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[7px] px-2 py-1.75 text-ui hover:bg-hover data-[locked=true]:cursor-not-allowed data-[locked=true]:opacity-45"
                  >
                    <input
                      type="checkbox"
                      checked={isFavorite}
                      disabled={isLocked}
                      onChange={() => {
                        onToggleFavorite(languageId);
                      }}
                      className="size-3.5 accent-accent"
                    />
                    {languages[languageId].name}
                    {!availableLanguageIds.includes(languageId) && (
                      <span className="ml-auto font-mono text-label text-faded">
                        not in this algorithm
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>

          {hasEveryFavorite && (
            <p className="px-2 pt-0.5 pb-1 text-meta text-tertiary">
              Uncheck one to choose another.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface FavoritePillsProps {
  favoriteLanguageIds: readonly LanguageId[];
  availableLanguageIds: readonly LanguageId[];
  shownLanguageId: LanguageId;
  onSelect: (languageId: LanguageId) => void;
}

function FavoritePills({
  favoriteLanguageIds,
  availableLanguageIds,
  shownLanguageId,
  onSelect,
}: FavoritePillsProps) {
  return (
    <div role="group" aria-label="Language" className="flex">
      {favoriteLanguageIds.map((languageId) => {
        const isAvailable = availableLanguageIds.includes(languageId);

        return (
          <button
            key={languageId}
            type="button"
            aria-pressed={languageId === shownLanguageId}
            disabled={!isAvailable}
            title={
              isAvailable ? undefined : "Not available for this algorithm yet"
            }
            onClick={() => {
              onSelect(languageId);
            }}
            className="rounded-md px-3 py-1.25 text-secondary enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:bg-selected aria-pressed:font-medium aria-pressed:text-foreground"
          >
            {languages[languageId].name}
          </button>
        );
      })}
    </div>
  );
}
