import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { router } from "./router.jsx";
import { configureAuthTokenProvider } from "./shared/api/apiClient.js";

export default function RouterApp() {
  const auth = useAuth();
  configureAuthTokenProvider((options) => auth.getToken(options));

  useEffect(() => {
    if (auth.isLoaded) router.invalidate();
  }, [auth.isLoaded, auth.isSignedIn]);

  if (!auth.isLoaded) {
    return <p className="p-6">Loading…</p>;
  }
  return <RouterProvider router={router} context={{ auth }} />;
}
