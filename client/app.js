import { World } from "@100x/engine/ecs";
import "./assets/styles.css";
import { WebComponent } from "./component";
import { html } from "lit";
import { assert } from "@100x/engine/asserts";

export class AppRoot extends WebComponent("app-root") {
	static get instance() {
		const it = document.body.querySelector("app-root");
		assert(it instanceof AppRoot);
		return it;
	}

	world = new World();

	render() {
		return html`
			<intro-loader></intro-loader>
			<page-outlet></page-outlet>
			<webgl-scene></webgl-scene>
		`;
	}
}
