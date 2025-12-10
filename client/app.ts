import "./assets/styles.css";
import "@awesome.me/webawesome/dist/styles/webawesome.css";

import { WebComponent } from "./component";
import { css, html } from "lit";
import { assert } from "elysiatech/lib";

export class AppRoot extends WebComponent("app-root")
{
	static get instance()
	{
		const it = document.body.querySelector("app-root");
		assert(it instanceof AppRoot);
		return it;
	}

	static styles = css`
		:host {

		}
	`

	render()
	{
		return html`
			<webgl-scene></webgl-scene>
			<intro-loader></intro-loader>
			<footer-section></footer-section>
			<page-outlet></page-outlet>
		`;
	}
}
