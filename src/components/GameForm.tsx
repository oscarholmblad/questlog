import { useState } from "react";
import type { FormEvent } from "react";
import { GAME_STATUSES, STATUS_LABELS } from "../types/game";
import type { GameStatus } from "../types/game";

export type GameFormValues = {
  title: string;
  platform: string;
  status: GameStatus;
  rating: number | null;
  coverUrl: string;
  notes: string;
};

type GameFormProps = {
  initialValues?: GameFormValues;
  submitLabel: string;
  isSaving: boolean;
  onSubmit: (values: GameFormValues) => void;
  onCancel?: () => void;
};

const EMPTY_VALUES: GameFormValues = {
  title: "",
  platform: "",
  status: "want",
  rating: null,
  coverUrl: "",
  notes: "",
};

function validate(values: GameFormValues): string | null {
  if (!values.title.trim()) return "Title is required.";
  if (!values.platform.trim()) return "Platform is required.";
  if (values.coverUrl.trim() && !/^https?:\/\//.test(values.coverUrl.trim())) {
    return "Cover URL must start with http:// or https://";
  }
  return null;
}

export function GameForm({
  initialValues = EMPTY_VALUES,
  submitLabel,
  isSaving,
  onSubmit,
  onCancel,
}: GameFormProps) {
  const [values, setValues] = useState<GameFormValues>(initialValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  function update<K extends keyof GameFormValues>(
    key: K,
    value: GameFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validate(values);
    setValidationError(error);
    if (error) return;

    onSubmit({
      ...values,
      title: values.title.trim(),
      platform: values.platform.trim(),
      coverUrl: values.coverUrl.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>
        Title *
        <input
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          maxLength={100}
          required
        />
      </label>

      <label>
        Platform *
        <input
          value={values.platform}
          onChange={(event) => update("platform", event.target.value)}
          maxLength={40}
          placeholder="PC, PS5, Switch..."
          required
        />
      </label>

      <div className="form-row">
        <label>
          Status
          <select
            value={values.status}
            onChange={(event) =>
              update("status", event.target.value as GameStatus)
            }
          >
            {GAME_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rating
          <select
            value={values.rating ?? ""}
            onChange={(event) =>
              update(
                "rating",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          >
            <option value="">Not rated</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Cover URL
        <input
          type="url"
          value={values.coverUrl}
          onChange={(event) => update("coverUrl", event.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Notes
        <textarea
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
          maxLength={1000}
          rows={4}
        />
      </label>

      {validationError && (
        <p className="error" role="alert">
          {validationError}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="button primary" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
