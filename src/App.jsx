import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BadgeProvider } from "./context/BadgeContext";
import { AIProvider } from "./context/AIContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <BadgeProvider>
        <AIProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AIProvider>
      </BadgeProvider>
    </AuthProvider>
  );
}

export default App;
