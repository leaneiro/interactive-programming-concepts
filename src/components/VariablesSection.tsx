import type { Snippet, Step } from "@/algorithms/algorithm";

interface VariablesSectionProps {
  step: Step;
  snippet: Snippet;
}

export function VariablesSection({ step, snippet }: VariablesSectionProps) {
  const variables = Object.entries(snippet.variableNames).flatMap(
    ([variableId, name]) =>
      name === undefined
        ? []
        : [
            {
              variableId,
              name,
              value: step.variables[variableId],
              isActive: step.activeVariables.includes(variableId),
            },
          ],
  );

  return (
    <section>
      <h2 className="px-4 pt-1.5 pb-1 section-label">Variables</h2>
      <dl className="flex flex-wrap gap-1.5 px-4 pb-3 font-mono text-ui text-foreground/90">
        {variables.map((variable) => (
          <div
            key={variable.variableId}
            data-active={variable.isActive}
            className="group flex flex-1 gap-2 rounded-md bg-chip px-2.5 py-1.75 whitespace-nowrap transition-colors duration-150 data-[active=true]:bg-accent-tint data-[active=true]:text-accent-text"
          >
            <dt className="text-tertiary group-data-[active=true]:text-accent-text">
              {variable.name}
            </dt>
            <dd>= {variable.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
