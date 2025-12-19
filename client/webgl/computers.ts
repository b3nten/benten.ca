import { createPrefab, remapRange, System, Transform, type Component } from "elysiatech";
import { ColliderComponent, RigidBodyComponent } from "./physics";
import { MathUtils, Vector3 } from "three";
import { globalAssets } from "../assets";
import * as Three from "three"

export class ComputerMovementComponent implements Component {
	scale: number;
	constructor(scale: number = 20) {
		this.scale = scale;
	}
}

export class ResizeBallComponent implements Component {}

export class ComputerMovementSystem extends System
{
	startup()
	{
		window.addEventListener("scroll", this._onScroll.bind(this));
	}

	update(delta: number)
	{
		for (const [, rbody, transform, bmvsys] of this.world.componentIterator(RigidBodyComponent, Transform, ComputerMovementComponent))
		{
			const rb = rbody.impl;
			if (!rb) continue;

			this._vec.copy(transform.position);
			this._vec.normalize();
			this._vec.set(
				-50 * delta * bmvsys.scale * this._vec.x,
				-300 * delta * bmvsys.scale * this._vec.y,
				-50 * delta * bmvsys.scale * this._vec.z,
			);

			rb.applyImpulse(this._vec, true);
		}
	}

	_onScroll()
	{
		const ballCollider = this.world.componentIterator(ResizeBallComponent, ColliderComponent).next();
		if(!ballCollider.done)
		{
			const rb = ballCollider.value[2].impl;
			if(rb)
			{
				const size = remapRange(window.scrollY, 0, window.innerHeight * 3, .05, 18);
				rb.setRadius(size);
			}
		}
	}

	_vec = new Vector3(0);
}

const scaleFactor = remapRange(window.innerWidth, 400, 1400, 0.8, 1.2);

export const balls = [...Array(100)].map(() => ({ scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)] * scaleFactor }));

let r = MathUtils.randFloatSpread;

export function createComputerPrefabFactory() {
	const monitor = globalAssets.unwrap("monitor").clone().children[0];
	const monitorCollider =
		rapier.ColliderDesc
			.convexHull(<Float32Array>(<Three.Mesh>monitor.children[0]).geometry.attributes.position.array)!
			.setMass(6)
			.setFriction(0.5);

	const terminal = globalAssets.unwrap("terminal").clone().children[0];
	const terminalCollider =
		rapier.ColliderDesc
			.convexHull(<Float32Array>(<Three.Mesh>terminal).geometry.attributes.position.array)!
			.setMass(6)
			.setFriction(0.5);

	return (args: { scale: number }) => {
		return createPrefab((world) => {
			let rand = Math.random();
			const mesh = rand > 0.5 ? monitor : terminal;
			const collider = rand > 0.5 ? monitorCollider : terminalCollider;
			return world.createEntityWith(
				mesh.clone(),
				new Transform().setPosition(r(20), r(20) + 25, r(20) - 10),
				new RigidBodyComponent(
					rapier
						.RigidBodyDesc.dynamic()
						.setLinearDamping(2)
						.setAngularDamping(1.5)
						.setCcdEnabled(true),
				),
				new ColliderComponent(collider),
				new ComputerMovementComponent(args.scale),
			);
		});
	}
}
