import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx"; // ✅ IMPORT
// main.jsx
import "./index.css"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* ✅ WRAP EVERYTHING */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);