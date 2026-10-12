import { useState } from "react";
import { algorithms } from "@/algorithms";
import type { Algorithm } from "@/algorithms/algorithm";
import { languageNames, type LanguageId } from "@/algorithms/languages";
import { CodePanel } from "@/components/CodePanel";
import { PlaybackControls } from "@/components/PlaybackControls";
import { SelectField } from "@/components/SelectField";
import { StepNote } from "@/components/StepNote";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePlayback } from "@/hooks/usePlayback";
import { useResizableWidth } from "@/hooks/useResizableWidth";
import { useTheme } from "@/hooks/useTheme";
import { StructureView } from "@/structures/StructureView";

const defaultAlgorithm = algorithms[0];
const defaultLanguageId: LanguageId = "typescript";

const algorithmOptions = algorithms.map((algorithm) => ({
  value: algorithm.id,
  label: algorithm.name,
}));

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm);
  const [preferredLanguageId, setPreferredLanguageId] =
    useState(defaultLanguageId);
  const [steps, setSteps] = useState(defaultAlgorithm.createTrace);
  const playback = usePlayback(steps.length);
  const codePanel = useResizableWidth({
    storageKey: "ipc:sidebarWidth",
    initialWidth: 420,
    minimumWidth: 320,
    maximumWidth: 720,
  });

  const step = steps[playback.stepIndex];
  const snippet =
    algorithm.snippets.find(
      (candidate) => candidate.languageId === preferredLanguageId,
    ) ?? algorithm.snippets[0];
  const languageOptions = algorithm.snippets.map(({ languageId }) => ({
    value: languageId,
    label: languageNames[languageId],
  }));

  function startNewTrace(nextAlgorithm: Algorithm): void {
    setAlgorithm(nextAlgorithm);
    setSteps(nextAlgorithm.createTrace());
    playback.restart();
  }

  function selectAlgorithm(algorithmId: string): void {
    const selectedAlgorithm = algorithms.find(
      (candidate) => candidate.id === algorithmId,
    );
    if (selectedAlgorithm) startNewTrace(selectedAlgorithm);
  }

  return (
    <div className="min-h-dvh">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <SelectField
          label="Algorithm"
          value={algorithm.id}
          options={algorithmOptions}
          onChange={selectAlgorithm}
        />
        <SelectField
          label="Language"
          value={snippet.languageId}
          options={languageOptions}
          onChange={setPreferredLanguageId}
        />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main
        style={{ "--code-panel-width": `${codePanel.width}px` }}
        className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto_var(--code-panel-width)] lg:gap-0"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <PlaybackControls
            playback={playback}
            onRandomize={() => {
              startNewTrace(algorithm);
            }}
          />
          <StepNote
            stepNumber={playback.stepIndex + 1}
            stepCount={steps.length}
            note={step.note}
          />
          <StructureView state={step.state} />
        </div>
        <div
          {...codePanel.separatorProps}
          aria-label="Resize code panel"
          className="mx-1 hidden w-2 cursor-col-resize touch-none rounded outline-none hover:bg-accent/20 focus-visible:bg-accent/30 lg:block"
        />
        <CodePanel
          title={algorithm.name}
          snippet={snippet}
          activeLines={snippet.regions[step.region]}
        />
      </main>
    </div>
  );
}
