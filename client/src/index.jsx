import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from './App'
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import "./styles/styles.css";
import { UserProvider } from './contexts/UserContext';
import {FavoritesProvider} from "./contexts/FavoritesContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <UserProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </UserProvider>

      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
