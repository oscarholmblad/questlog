type RatingProps = {
  value: number | null;
};

export function Rating({ value }: RatingProps) {
  if (value === null) {
    return <span className="rating muted">Not rated</span>;
  }

  return (
    <span className="rating" aria-label={`Rating: ${value} of 5`}>
      {"★".repeat(value)}
      <span className="muted">{"★".repeat(5 - value)}</span>
    </span>
  );
}
