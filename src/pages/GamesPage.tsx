import { ErrorMessage } from "../components/ErrorMessage";
import { GameList } from "../components/GameList";
import { Loading } from "../components/Loading";
import { StatusFilter } from "../components/StatusFilter";
import { useGames } from "../hooks/useGames";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isStatusFilter } from "../types/game";
import type { StatusFilter as StatusFilterValue } from "../types/game";

export function GamesPage() {
  const [savedFilter, setFilter] = useLocalStorage<StatusFilterValue>(
    "questlog-status-filter",
    "all",
  );
  // Skydd om localStorage innehåller ett ogiltigt värde
  const filter = isStatusFilter(savedFilter) ? savedFilter : "all";
  const { games, isLoading, error } = useGames(filter);

  return (
    <section>
      <h1>My games</h1>
      <StatusFilter value={filter} onChange={setFilter} />

      {isLoading ? (
        <Loading text="Loading games..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <GameList games={games} />
      )}
    </section>
  );
}
