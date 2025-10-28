import { World } from "@100x/engine/ecs";
import { AppStateSystem, AppState } from "./app";
import { ClientRoutingSystem, navigateEvent } from "@100x/router";
import { clientRouter } from "./clientRouter";

const world = new World();

world.addSystem(ClientRoutingSystem, clientRouter);

world.addSystem(AppStateSystem);
world.createEntityWith(new AppState());

world.startup();

const btn = document.createElement("button");
btn.textContent = "Click me";
document.body.appendChild(btn);

btn.addEventListener("click", () => {
  world.sendEvent(navigateEvent, {
    to: "/demos/" + Math.random().toString(36).substring(2, 15),
  });
});
