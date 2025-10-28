import { clientEntry, manifest } from "@100x/application/server";
import { Router } from "@100x/router";
import { metaHandlers, routeDefinitions } from "./routes";
import { createHead, transformHtmlTemplateRaw } from "unhead/server";
import lazyRoutes from "virtual:100x/lazy-routes";
import { Hono } from "hono";

const app = new Hono();
const router = new Router(routeDefinitions, [metaHandlers]);

app.get("*", (c) => {
  const head = createHead();
  head.push({
    link: clientEntry.css.map((href) => ({ rel: "stylesheet", href })),
    script: [{ src: clientEntry.file, type: "module" }],
  });
  const matches = router.match(c.req.url);
  for (const match of matches) {
    for (const result of match.data) {
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
  }
  return c.html(transformHtmlTemplateRaw(head, `<!DOCTYPE html><head></head>`));
});

export default app.fetch;

import { h } from "preact";
