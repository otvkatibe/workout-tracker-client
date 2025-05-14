import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "./components/LoadingContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
      <ToastContainer position="top-center" />
    </LoadingProvider>
  </React.StrictMode>
);
