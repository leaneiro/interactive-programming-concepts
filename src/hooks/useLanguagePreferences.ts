import { useState } from "react";
import { languageIds, type LanguageId } from "@/algorithms/languages";
import { readStoredValue, storeValue } from "@/lib/storage";

export const favoriteLanguageLimit = 3;

const favoritesStorageKey = "ipc:favoriteLanguages";
const preferredStorageKey = "ipc:language";

function readStoredFavorites(): LanguageId[] {
  const storedIds = readStoredValue(favoritesStorageKey)?.split(",") ?? [];
  const storedFavorites = languageIds
    .filter((languageId) => storedIds.includes(languageId))
    .slice(0, favoriteLanguageLimit);

  return storedFavorites.length > 0
    ? storedFavorites
    : languageIds.slice(0, favoriteLanguageLimit);
}

function readStoredPreferredLanguage(): LanguageId {
  const storedId = readStoredValue(preferredStorageKey);

  return (
    languageIds.find((languageId) => languageId === storedId) ??
    readStoredFavorites()[0]
  );
}

export function useLanguagePreferences() {
  const [favoriteLanguageIds, setFavoriteLanguageIds] =
    useState(readStoredFavorites);
  const [preferredLanguageId, setPreferredLanguageId] = useState(
    readStoredPreferredLanguage,
  );

  function selectLanguage(languageId: LanguageId): void {
    setPreferredLanguageId(languageId);
    storeValue(preferredStorageKey, languageId);
  }

  function toggleFavorite(languageId: LanguageId): void {
    const isFavorite = favoriteLanguageIds.includes(languageId);
    const isLastFavorite = isFavorite && favoriteLanguageIds.length === 1;
    const isOverLimit =
      !isFavorite && favoriteLanguageIds.length === favoriteLanguageLimit;
    if (isLastFavorite || isOverLimit) return;

    const nextFavoriteIds = languageIds.filter((candidateId) =>
      candidateId === languageId
        ? !isFavorite
        : favoriteLanguageIds.includes(candidateId),
    );
    setFavoriteLanguageIds(nextFavoriteIds);
    storeValue(favoritesStorageKey, nextFavoriteIds.join(","));

    if (!isFavorite) selectLanguage(languageId);
    if (isFavorite && preferredLanguageId === languageId) {
      selectLanguage(nextFavoriteIds[0]);
    }
  }

  return {
    favoriteLanguageIds,
    preferredLanguageId,
    selectLanguage,
    toggleFavorite,
  };
}
