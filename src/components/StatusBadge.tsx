import { STATUS_LABELS } from "../types/game";
import type { GameStatus } from "../types/game";

type StatusBadgeProps = {
  status: GameStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
  );
}
