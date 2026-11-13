import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Cover } from "../components/Cover";
import { ErrorMessage } from "../components/ErrorMessage";
import { GameForm } from "../components/GameForm";
import type { GameFormValues } from "../components/GameForm";
import { Loading } from "../components/Loading";
import { Rating } from "../components/Rating";
import { StatusBadge } from "../components/StatusBadge";
import { useGame, useSaveGame } from "../hooks/useGames";
import type { Game, GameChanges } from "../types/game";
import { NotFoundPage } from "./NotFoundPage";

function getChanges(game: Game, values: GameFormValues): GameChanges {
  const changes: GameChanges = {};
  if (values.title !== game.title) changes.title = values.title;
  if (values.platform !== game.platform) changes.platform = values.platform;
  if (values.status !== game.status) changes.status = values.status;
  if (values.rating !== game.rating) changes.rating = values.rating;
  if (values.coverUrl !== game.coverUrl) changes.coverUrl = values.coverUrl;
  if (values.notes !== game.notes) changes.notes = values.notes;
  return changes;
}

export function GamePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { game, isLoading, error, notFound, setGame } = useGame(id);
  const { updateGame, deleteGame, isSaving, error: saveError } = useSaveGame();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <Loading text="Loading game..." />;
  if (notFound) return <NotFoundPage title="Game not found" />;
  if (error || !game)
    return <ErrorMessage message={error ?? "Could not load the game."} />;

  async function handleUpdate(values: GameFormValues) {
    if (!game) return;
    const changes = getChanges(game, values);

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    const updated = await updateGame(game.id, changes);
    if (updated) {
      setGame(updated);
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    if (!game) return;
    if (!window.confirm(`Delete "${game.title}"?`)) return;

    const deleted = await deleteGame(game.id);
    if (deleted) navigate("/");
  }

  return (
    <article>
      <Link to="/" className="back-link">
        ← Back to games
      </Link>

      {saveError && <ErrorMessage message={saveError} />}

      {isEditing ? (
        <>
          <h1>Edit {game.title}</h1>
          <GameForm
            initialValues={{
              title: game.title,
              platform: game.platform,
              status: game.status,
              rating: game.rating,
              coverUrl: game.coverUrl,
              notes: game.notes,
            }}
            submitLabel="Save changes"
            isSaving={isSaving}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <div className="detail-grid">
          <Cover url={game.coverUrl} title={game.title} />

          <div>
            <h1>{game.title}</h1>
            <dl className="detail-list">
              <dt>Platform</dt>
              <dd>{game.platform}</dd>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={game.status} />
              </dd>
              <dt>Rating</dt>
              <dd>
                <Rating value={game.rating} />
              </dd>
              <dt>Notes</dt>
              <dd>{game.notes || <span className="muted">No notes</span>}</dd>
            </dl>

            <div className="form-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => setIsEditing(true)}
                disabled={isSaving}
              >
                Edit
              </button>
              <button
                type="button"
                className="button danger"
                onClick={handleDelete}
                disabled={isSaving}
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
