import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";

interface SelectOption<Value extends string> {
  value: Value;
  label: string;
}

interface SelectFieldProps<Value extends string> {
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onChange: (value: Value) => void;
}

export function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const selectedOption = options.find(
      (option) => option.value === event.target.value,
    );
    if (selectedOption) onChange(selectedOption.value);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={handleChange}
          className="cursor-pointer appearance-none rounded-lg border border-border bg-panel py-1.5 pr-8 pl-2 outline-none focus-visible:border-accent"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted"
        />
      </span>
    </label>
  );
}
