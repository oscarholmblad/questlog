import { GAME_STATUSES, STATUS_LABELS } from "../types/game";
import type { StatusFilter as StatusFilterValue } from "../types/game";

type StatusFilterProps = {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
};

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...GAME_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="filter" role="group" aria-label="Filter by status">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            option.value === value ? "filter-button active" : "filter-button"
          }
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
