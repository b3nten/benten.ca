import { css, html } from "lit";
import * as Three from "three";
import { assert } from "@100x/engine/asserts";
import { AppRoot } from "./app";
import { MapControls } from "three/examples/jsm/Addons.js";
import {
	ActiveCameraComponent,
	RendererComponent,
	SceneComponent,
	ThreeObjectSystem,
	ThreeRenderSystem,
	Transform,
	Viewport,
} from "@100x/engine/three";
import { ActorSystem, System } from "@100x/engine/ecs";
import { Frameloop } from "@100x/engine/lib";
import { WebComponent } from "./component";
import { globalAssets } from "./assets";

await globalAssets.load();

export class WebGlScene extends WebComponent("webgl-scene") {
	static styles = css`
		canvas {
			position: fixed;
			width: 100%;
			height: 100%;
		}
	`;

	frameloop: Frameloop | undefined;

	onMounted() {
		const scene = this.createScene();
		scene.startup();
		this.frameloop = new Frameloop(scene.update);
	}

	createScene() {
		const world = AppRoot.instance.world;

		world.addSystem(ActorSystem);
		world.addSystem(MapControlCameraSystem);
		world.addSystem(ThreeObjectSystem);
		world.addSystem(ThreeRenderSystem);

		world.createEntityWith(
			Viewport.fullScreenCanvas(this.canvas),
			new RendererComponent(new Three.WebGLRenderer({ canvas: this.canvas })),
			new SceneComponent(
				new Three.Scene().also((it) => {
					it.fog = new Three.Fog("black", 10, 30);
				}),
			),
			new Three.AmbientLight(0xffffff, 1),
			new Transform(),
		);

		world.createEntityWith(
			new Transform()
				.setPosition(5, 7, 11)
				.setRotation(-0.25, 0.16, 0.04, 0.95),
			new Three.PerspectiveCamera(
				75,
				window.innerWidth / window.innerHeight,
				0.1,
				1000,
			),
			new ActiveCameraComponent(),
		);

		world.createEntityWith(
			new Transform(),
			globalAssets.unwrap("scene").clone(),
		);

		return world;
	}

	onUnmount() {
		this.frameloop?.stop();
	}

	get canvas() {
		assert(this.shadowRoot, "No shadow root");
		const canvas = this.shadowRoot.querySelector("canvas");
		assert(canvas, "No canvas element found");
		return canvas;
	}

	render() {
		return html`<canvas></canvas>`;
	}
}

class MapControlCameraSystem extends System {
	camera = new Three.PerspectiveCamera();
	controls: MapControls | undefined;

	startup() {
		this.controls = new MapControls(
			this.camera,
			this.world.resolveComponent(RendererComponent)!.value.domElement,
		);
		this.controls.enableDamping = true;
		// this.controls.enableRotate = false;
		this.controls.maxDistance = 15;
		this.controls.minDistance = 5;

		for (const [, transform] of this.world.entitiesWith(
			Transform,
			ActiveCameraComponent,
		)) {
			this.camera.position.copy(transform.position);
			this.camera.quaternion.copy(transform.rotation);
		}
		this.controls.update();
	}

	update(frametime: number) {
		assert(this.controls);
		this.controls.update(frametime);
		for (const [, transform] of this.world.entitiesWith(
			Transform,
			ActiveCameraComponent,
		)) {
			transform.position.copy(this.camera.position);
			transform.rotation.copy(this.camera.quaternion);
		}
	}
}
