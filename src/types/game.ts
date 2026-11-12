export const GAME_STATUSES = [
  "want",
  "playing",
  "completed",
  "dropped",
] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

export type StatusFilter = GameStatus | "all";

export const STATUS_LABELS: Record<GameStatus, string> = {
  want: "Want to play",
  playing: "Playing",
  completed: "Completed",
  dropped: "Dropped",
};

export type Game = {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
  rating: number | null;
  coverUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type NewGame = {
  title: string;
  platform: string;
  status: GameStatus;
  rating?: number | null;
  coverUrl?: string;
  notes?: string;
};

export type GameChanges = Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>;

export function isStatusFilter(value: unknown): value is StatusFilter {
  return value === "all" || GAME_STATUSES.includes(value as GameStatus);
}
