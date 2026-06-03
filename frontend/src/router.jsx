import { createHashRouter } from "react-router-dom";
import App from "./App.jsx";
import Welcome from "./pages/Welcome.jsx";
import IntroName from "./pages/IntroName.jsx";
import IntroTour from "./pages/IntroTour.jsx";
import SelectRole from "./pages/SelectRole.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// HashRouter porque Electron carga el frontend desde file://
export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true,            element: <Welcome /> },
      { path: "intro",          element: <IntroName /> },
      { path: "tour",           element: <IntroTour /> },
      { path: "select-role",    element: <SelectRole /> },
      { path: "dashboard",      element: <Dashboard /> },
    ],
  },
]);
