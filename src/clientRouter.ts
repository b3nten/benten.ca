import { ClientRouter, MetaRouteMiddleware } from "@100x/router";
import { metaHandlers, routeDefinitions } from "./routes";

export const clientRouter = new ClientRouter({
  routes: routeDefinitions,
  handlers: [metaHandlers] as const,
  middlewares: [new MetaRouteMiddleware()],
});

export const routes = clientRouter.routes;
