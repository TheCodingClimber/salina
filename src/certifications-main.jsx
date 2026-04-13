import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CertsPage from "./pages/Certs.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CertsPage />
  </StrictMode>,
);
