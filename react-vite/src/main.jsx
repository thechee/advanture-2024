import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import { APIProvider } from '@vis.gl/react-google-maps';
import "./index.css";

const store = configureStore();

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
      <APIProvider apiKey={API_KEY}>
      <RouterProvider router={router} />
      </APIProvider>
    </ReduxProvider>
);
