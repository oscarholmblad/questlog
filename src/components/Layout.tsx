import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <NavLink to="/" className="logo">
          Questlog
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            Games
          </NavLink>
          <NavLink to="/games/new">Add game</NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">Questlog – my game backlog</footer>
    </div>
  );
}
