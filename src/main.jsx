import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>

    <Provider store={store}>
      <App />
    </Provider>
    </HashRouter>
  </StrictMode>
);
