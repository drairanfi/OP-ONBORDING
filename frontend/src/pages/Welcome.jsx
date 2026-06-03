// Welcome → muestra splash y avanza automáticamente.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../components/SplashScreen.jsx";

export default function Welcome() {
  const nav = useNavigate();

  useEffect(() => {
    // Tiempo alineado con la cadena de entradas del splash (~3.2s) + respiro de lectura.
    const t = setTimeout(() => nav("/intro"), 3800);
    return () => clearTimeout(t);
  }, [nav]);

  return <SplashScreen />;
}
