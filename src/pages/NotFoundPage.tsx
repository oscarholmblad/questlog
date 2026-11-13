import { Link } from "react-router";

type NotFoundPageProps = {
  title?: string;
};

export function NotFoundPage({ title = "Page not found" }: NotFoundPageProps) {
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>{title}</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="button primary">
        Back to games
      </Link>
    </section>
  );
}
