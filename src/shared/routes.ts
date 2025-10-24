import { Routes } from "@100x/router";
import { aboutHandler } from "~/clientMain/routes/about";
import { homeHandler } from "~/clientMain/routes/home";

const routeDefinitions = new Routes("/", {
  root: "*",
  home: "/",
  about: "/about",
});

export const handlers = routeDefinitions.createHandlers({
  root: () => ({
    meta: { title: "benten" },
  }),
  home: homeHandler,
  about: aboutHandler,
});

export const routes = routeDefinitions.withHandlerTypes<typeof handlers>();
