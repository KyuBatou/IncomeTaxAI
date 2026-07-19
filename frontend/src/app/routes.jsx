import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import PaymentGuard from "./auth/PaymentGuard";
// import materialRoutes from "app/views/material-kit/MaterialRoutes";

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics3")));
const GST = Loadable(lazy(() => import("app/views/gst/App")));
const SubscribeTable = Loadable(lazy(() => import("app/views/subscribe/App")));
const ContentTable = Loadable(lazy(() => import("app/views/legal-content/App")));
const UserSetting = Loadable(lazy(() => import("app/views/settings/App")));

const routes = [
  { path: "/", element: <Navigate to="dashboard" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      // ...materialRoutes,
      // dashboard route
      // { path: "/dashboard", element: <Analytics />, auth: authRoles.admin },
      {
        path: "/gst",
        element: (
          <PaymentGuard>
            <GST />
          </PaymentGuard>
        ),
        auth: authRoles.admin,
      },
      // { path: "/gst", element: <GST />, auth: authRoles.admin },
      { path: "/user-setting", element: <UserSetting />, auth: authRoles.guest },

    ]
  },
  { path: "/dashboard", element: <Analytics />, auth: authRoles.admin },
  { path: "/subscribe", element: <SubscribeTable />, auth: authRoles.guest},
  { path: "/content/:slug/*", element: <ContentTable />, auth: authRoles.guest},

  // session pages route
  ...sessionRoutes
];

export default routes;
