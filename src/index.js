import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="315113211603-60mhaa95md97kl1co1dhkrmak147mom3.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
