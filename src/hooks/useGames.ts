import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import type { Game, GameChanges, NewGame, StatusFilter } from "../types/game";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: options.body
        ? { "Content-Type": "application/json" }
        : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new Error(
      "Could not reach the server. Check your connection and try again.",
      {
        cause: error,
      },
    );
  }

  if (!response.ok) {
    let message = `Something went wrong (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Inget JSON-svar, då används standardmeddelandet
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

type FetchState<T> = {
  path: string;
  data: T | null;
  error: string | null;
  notFound: boolean;
};

function useFetch<T>(path: string) {
  const [state, setState] = useState<FetchState<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    request<T>(path, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ path, data, error: null, notFound: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          path,
          data: null,
          error: getErrorMessage(error),
          notFound: error instanceof ApiError && error.status === 404,
        });
      });

    return () => controller.abort();
  }, [path]);

  const current = state !== null && state.path === path ? state : null;

  const setData = useCallback(
    (data: T) => setState({ path, data, error: null, notFound: false }),
    [path],
  );

  return {
    data: current?.data ?? null,
    isLoading: current === null,
    error: current?.error ?? null,
    notFound: current?.notFound ?? false,
    setData,
  };
}

export function useGames(status: StatusFilter) {
  const query = status === "all" ? "" : `?status=${status}`;
  const { data, isLoading, error } = useFetch<Game[]>(`/games${query}`);

  return { games: data ?? [], isLoading, error };
}

export function useGame(id: string) {
  const { data, isLoading, error, notFound, setData } = useFetch<Game>(
    `/games/${encodeURIComponent(id)}`,
  );

  return { game: data, isLoading, error, notFound, setGame: setData };
}

export function useSaveGame() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run<T>(action: () => Promise<T>): Promise<T | null> {
    setIsSaving(true);
    setError(null);
    try {
      return await action();
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  function createGame(game: NewGame) {
    return run(() =>
      request<Game>("/games", { method: "POST", body: JSON.stringify(game) }),
    );
  }

  function updateGame(id: string, changes: GameChanges) {
    return run(() =>
      request<Game>(`/games/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      }),
    );
  }

  async function deleteGame(id: string) {
    const result = await run(() =>
      request<{ message: string; game: Game }>(
        `/games/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      ),
    );
    return result !== null;
  }

  return { createGame, updateGame, deleteGame, isSaving, error };
}
