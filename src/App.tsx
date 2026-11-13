import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { GamePage } from "./pages/GamePage";
import { GamesPage } from "./pages/GamesPage";
import { NewGamePage } from "./pages/NewGamePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<GamesPage />} />
        <Route path="games" element={<Navigate to="/" replace />} />
        <Route path="games/new" element={<NewGamePage />} />
        <Route path="games/:id" element={<GamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
