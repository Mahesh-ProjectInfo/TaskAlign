import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MasterDataProvider } from "./context/MasterDataContext.jsx";
import { AssignmentDraftProvider } from "./context/AssignmentDraftContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MasterDataProvider>
          <AssignmentDraftProvider>
            <App />
          </AssignmentDraftProvider>
        </MasterDataProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop theme="light" />
    </BrowserRouter>
  </React.StrictMode>,
);
