import { clientEntry, manifest } from "@100x/application/server";
import { Router } from "@100x/router";
import { handlers, routes } from "../shared/routes";
import { createHead, transformHtmlTemplate } from "unhead/server";
import lazyRoutes from "virtual:100x/lazy-routes";
import { Hono } from "hono";

const app = new Hono();
const router = new Router(routes, handlers);

app.get("/api/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

app.get("*", (c) => {
  const head = createHead();
  head.push({
    link: clientEntry.css.map((href) => ({ rel: "stylesheet", href })),
    script: [{ src: clientEntry.file, type: "module" }],
  });
  const matches = router.match(c.req.url);
  for (const match of matches) {
    const result = match.handler();
    if (
      result &&
      typeof result === "object" &&
      "meta" in result &&
      result.meta
    ) {
      head.push(result.meta);
    }
    if (lazyRoutes[match.route.id]) {
      head.push({
        link: lazyRoutes[match.route.id]
          .map((path) => manifest[path]?.file)
          .filter(Boolean)
          .map((href) => ({ rel: "preload", href, as: "script" })),
      });
    }
  }
  return c.html(transformHtmlTemplate(head, "<head></head>"));
});

export default app.fetch;
