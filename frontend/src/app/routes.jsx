import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
// import materialRoutes from "app/views/material-kit/MaterialRoutes";

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const GST = Loadable(lazy(() => import("app/views/gst/ask_bot/App")));

const routes = [
  { path: "/", element: <Navigate to="gst" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      // ...materialRoutes,
      // dashboard route
      { path: "/dashboard", element: <Analytics />, auth: authRoles.admin },
      { path: "/gst", element: <GST />, auth: authRoles.admin },
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
