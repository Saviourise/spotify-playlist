import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PlaylistsProvider } from "./context/PlaylistsProvider";
import "./styles/index.css";
import "./styles/components.css";
import "./styles/pages.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlaylistsProvider>
        <App />
      </PlaylistsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
