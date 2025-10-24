import "~/clientMain/assets/styles.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, LazyRoute, Link, Route } from "@100x/react";
import { ClientRouter, MetaRouteMiddleware } from "@100x/router";
import { routes, handlers } from "~/shared/routes";
import { WebGL } from "./webgl";
import { Home } from "./routes/home";
import About from "./routes/about";

const router = new ClientRouter({
  routes,
  handlers,
  middlewares: [new MetaRouteMiddleware()],
});

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router}>
        <Route match={routes.home}>
          <Home />
        </Route>
        <Route match={routes.about}>
          <About />
        </Route>
        <WebGL />
      </RouterProvider>
    </StrictMode>
  );
}

createRoot(document.body).render(<App />);
