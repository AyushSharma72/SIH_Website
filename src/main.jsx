import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <App />
  </>
);
