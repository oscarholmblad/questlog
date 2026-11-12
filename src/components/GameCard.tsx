import { Link } from "react-router";
import type { Game } from "../types/game";
import { Cover } from "./Cover";
import { Rating } from "./Rating";
import { StatusBadge } from "./StatusBadge";

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <li>
      <Link to={`/games/${game.id}`} className="card">
        <Cover url={game.coverUrl} title={game.title} />
        <div className="card-body">
          <h2 className="card-title">{game.title}</h2>
          <p className="muted">{game.platform}</p>
          <div className="card-meta">
            <StatusBadge status={game.status} />
            <Rating value={game.rating} />
          </div>
        </div>
      </Link>
    </li>
  );
}
