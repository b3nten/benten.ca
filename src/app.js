import { System, eventHandler } from "@100x/engine/ecs";
import { navigationEvent, routeHandler } from "@100x/router";
import { observable } from "mobx";
import { routes } from "./clientRouter";

export class AppState {
  @observable accessor idk = "idk";
}

export class AppStateSystem extends System {
  @eventHandler(navigationEvent)
  onNavigate(event) {
    //
  }

  @routeHandler(routes.demos.demo)
  handleDemoRoute(matches) {
    //
  }
}
