type LoadingProps = {
  text?: string;
};

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <p className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </p>
  );
}
