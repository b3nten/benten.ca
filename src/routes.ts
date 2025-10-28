import { group, RouteDefinition } from "@100x/router";

export const routeDefinitions = new RouteDefinition({
  root: "*",
  home: "/",
  foo: "/foo",
  demos: group("/demos", {
    index: "/",
    demo: "/:demo",
  }),
});

const meta =
  <T>(meta: T) =>
  () => ({ meta });

export const metaHandlers = routeDefinitions.createHandlers({
  root: meta({
    title: "benten",
  }),
  home: meta({
    title: "benten - home",
  }),
  demos: {
    root: meta({
      title: "benten - demos",
    }),
    demo: (_, { demo }) =>
      meta({
        title: `benten - ${demo}`,
      })(),
  },
});
