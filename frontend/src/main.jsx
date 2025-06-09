import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, AddNote, Login, Signup, Profile } from "./pages/index.jsx";
import { PrivateRoute } from "./components/index.jsx";
import store from "./store/store.js";
import App from "./App.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/addnote",
        element: (
          <PrivateRoute>
            <AddNote />
          </PrivateRoute>
        ),
      },
      {
        path: "/editNote/:id",
        element: (
          <PrivateRoute>
            <AddNote />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      { path: "/user/login", element: <Login /> },
      { path: "/user/signup", element: <Signup /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
