import { useNavigate } from "react-router";
import { ErrorMessage } from "../components/ErrorMessage";
import { GameForm } from "../components/GameForm";
import type { GameFormValues } from "../components/GameForm";
import { useSaveGame } from "../hooks/useGames";
import type { NewGame } from "../types/game";

export function NewGamePage() {
  const navigate = useNavigate();
  const { createGame, isSaving, error } = useSaveGame();

  async function handleSubmit(values: GameFormValues) {
    const newGame: NewGame = {
      title: values.title,
      platform: values.platform,
      status: values.status,
      rating: values.rating,
      notes: values.notes,
    };
    // API:et kräver att coverUrl börjar med http(s), så tom sträng skickas inte
    if (values.coverUrl) newGame.coverUrl = values.coverUrl;

    const created = await createGame(newGame);
    if (created) navigate(`/games/${created.id}`);
  }

  return (
    <section>
      <h1>Add game</h1>
      {error && <ErrorMessage message={error} />}
      <GameForm
        submitLabel="Add game"
        isSaving={isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </section>
  );
}
