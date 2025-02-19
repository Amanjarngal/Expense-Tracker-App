import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProviderWrapper } from "./context/themeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  <ThemeProviderWrapper>
    <ToastContainer />
    <App />
    </ThemeProviderWrapper>
  </>
);
