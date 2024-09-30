import { createRoot } from "react-dom/client";

import Approutes from "./Approutes.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <Approutes />
  </>
);
