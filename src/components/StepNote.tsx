interface StepNoteProps {
  stepNumber: number;
  stepCount: number;
  note: string;
}

export function StepNote({ stepNumber, stepCount, note }: StepNoteProps) {
  return (
    <div className="panel p-3 text-sm" role="status" aria-live="polite">
      <p className="mb-2 text-muted">
        Step {stepNumber} / {stepCount}
      </p>
      <p className="leading-relaxed">{note}</p>
    </div>
  );
}
