import { css, html } from "lit";
import { WebComponent } from "../component";
import { Engine, assert, Frameloop } from "elysiatech";
import { webglEntry } from "./entry";
import { loadRapier } from "./physics";
import { globalAssets } from "../assets";
import { HidefRenderPipeline } from "./renderer";


export class WebGlScene extends WebComponent("webgl-scene")
{
	static styles = css`
		canvas {
			position: fixed;
			width: 100%;
			height: 100%;
			z-index: 0;
		}
	`;

	get canvas()
	{
		assert(this.shadowRoot, "No shadow root");
		const canvas = this.shadowRoot.querySelector("canvas");
		assert(canvas, "No canvas element found");
		return canvas;
	}

	async onMounted()
	{
		await Promise.all([globalAssets.load(), loadRapier()])
		this._frameloop = new Engine({
			canvas: this.canvas,
			init: webglEntry,
			renderPipeline: new HidefRenderPipeline,
		}).run()
	}

	onUnmount()
	{
		this._frameloop?.stop();
	}

	render()
	{
		return html`<canvas></canvas>`;
	}

	private _frameloop: Frameloop | undefined;
}
