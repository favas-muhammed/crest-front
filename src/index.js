import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
