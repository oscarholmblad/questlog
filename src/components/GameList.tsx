import type { Game } from "../types/game";
import { GameCard } from "./GameCard";

type GameListProps = {
  games: Game[];
};

export function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return <p className="empty">No games here yet.</p>;
  }

  return (
    <ul className="game-list">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </ul>
  );
}
