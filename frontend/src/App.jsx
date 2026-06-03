import { Outlet } from "react-router-dom";
import TitleBar from "./components/ui/TitleBar.jsx";
import NoiseOverlay from "./components/ui/NoiseOverlay.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <NoiseOverlay opacity={0.025} />
      <TitleBar />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
