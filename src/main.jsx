import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./lib/authContext.jsx"; // ✅ IMPORT
// main.jsx
import "./index.css"; 
import axios from "axios";

axios.defaults.baseURL = "https://digital-attendance-backend-final.onrender.com";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* ✅ WRAP EVERYTHING */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);