import { useState } from "react";
import { algorithms } from "@/algorithms";
import type { Algorithm } from "@/algorithms/algorithm";
import { CodeColumn } from "@/components/CodeColumn";
import { HistorySection } from "@/components/HistorySection";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { MemorySection } from "@/components/MemorySection";
import { Sidebar } from "@/components/Sidebar";
import { StudioHeader } from "@/components/StudioHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Timeline } from "@/components/Timeline";
import { Transport } from "@/components/Transport";
import { VariablesSection } from "@/components/VariablesSection";
import { useLanguagePreferences } from "@/hooks/useLanguagePreferences";
import { usePlayback } from "@/hooks/usePlayback";
import { usePlaybackShortcuts } from "@/hooks/usePlaybackShortcuts";
import { useTheme } from "@/hooks/useTheme";
import { StructureView } from "@/structures/StructureView";

const defaultAlgorithm = algorithms[0];

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm);
  const languagePreferences = useLanguagePreferences();
  const [steps, setSteps] = useState(defaultAlgorithm.createTrace);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const playback = usePlayback(steps.length);
  usePlaybackShortcuts(playback);

  const step = steps[playback.stepIndex];
  const snippet =
    [
      languagePreferences.preferredLanguageId,
      ...languagePreferences.favoriteLanguageIds,
    ]
      .map((languageId) =>
        algorithm.snippets.find(
          (candidate) => candidate.languageId === languageId,
        ),
      )
      .find((candidate) => candidate !== undefined) ?? algorithm.snippets[0];

  function startNewTrace(nextAlgorithm: Algorithm): void {
    setAlgorithm(nextAlgorithm);
    setSteps(nextAlgorithm.createTrace());
    setIsNavigationOpen(false);
    playback.restart();
  }

  return (
    <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] bg-surface font-sans leading-[normal] text-foreground split:h-dvh studio:grid-cols-[14.5rem_minmax(0,1fr)]">
      <Sidebar
        algorithms={algorithms}
        selectedAlgorithmId={algorithm.id}
        isOpen={isNavigationOpen}
        onOpen={() => {
          setIsNavigationOpen(true);
        }}
        onClose={() => {
          setIsNavigationOpen(false);
        }}
        onSelect={startNewTrace}
      />

      <div className="grid min-h-0 min-w-0 grid-rows-[3.75rem_minmax(0,1fr)]">
        <StudioHeader
          algorithm={algorithm}
          onOpenNavigation={() => {
            setIsNavigationOpen(true);
          }}
        >
          <LanguageSwitch
            favoriteLanguageIds={languagePreferences.favoriteLanguageIds}
            availableLanguageIds={algorithm.snippets.map(
              (candidate) => candidate.languageId,
            )}
            shownLanguageId={snippet.languageId}
            onSelect={languagePreferences.selectLanguage}
            onToggleFavorite={languagePreferences.toggleFavorite}
          />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </StudioHeader>

        <div className="grid min-h-0 split:grid-cols-[minmax(0,1fr)_30rem]">
          <main className="@container grid min-h-0 grid-rows-[3.25rem_22rem_auto_auto] border-border split:grid-rows-[3.25rem_minmax(0,3fr)_minmax(0,2fr)_auto] split:border-r">
            <Timeline
              step={step}
              stepIndex={playback.stepIndex}
              stepCount={steps.length}
              regions={snippet.regions}
              onSeek={playback.goToStep}
            />
            <StructureView state={step.state} />
            <div className="min-h-0 overflow-y-auto border-t border-border bg-sunken @[34.5rem]:grid @[34.5rem]:grid-cols-[minmax(23.5rem,1fr)_minmax(11rem,18.75rem)] @[34.5rem]:overflow-visible">
              <div className="border-border @[34.5rem]:min-h-0 @[34.5rem]:overflow-y-auto @[34.5rem]:border-r">
                <MemorySection state={step.state} />
                <VariablesSection step={step} snippet={snippet} />
              </div>
              <HistorySection
                steps={steps}
                stepIndex={playback.stepIndex}
                onSelectStep={playback.goToStep}
              />
            </div>
            <Transport
              playback={playback}
              onShuffle={() => {
                startNewTrace(algorithm);
              }}
            />
          </main>

          <CodeColumn
            algorithmId={algorithm.id}
            snippet={snippet}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}
