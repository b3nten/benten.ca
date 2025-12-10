import { InfiniteGridHelper, mustExist, remapRange, Transform, World } from "elysiatech";
import * as Three from "three";
import { MainCameraPrefab } from "./camera";
import { ComputerMovementSystem, createComputerPrefabFactory } from "./computers";
import { PointerMovementSystem, PointerPrefab } from "./pointer";
import { ColliderComponent, PhysicsSystem } from "./physics";

const SCALE_FACTOR = remapRange(window.innerWidth, 400, 1400, 0.8, 1.2);

export function webglEntry(world: World)
{
	// setup systems
	world.addSystem(PhysicsSystem, { x: 0, y: -9.81, z: 0 });
	world.addSystem(ComputerMovementSystem);
	world.addSystem(PointerMovementSystem);

	const scene = mustExist(world.getSingletonComponent(Three.Scene))
	scene.background = new Three.Color("blue")

	world.addPrefabs(
		MainCameraPrefab,
		PointerPrefab,
		...Array.from({ length: 100 })
			.map(() => ({ scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)] * SCALE_FACTOR }))
			.map(createComputerPrefabFactory()),
	);

	globalThis.RESIZE_BALL_ENTITY = world.createEntityWith(
		new Transform,
		new ColliderComponent(rapier.ColliderDesc.ball(.5))
	)

	world.createEntityWith(
		new Three.AmbientLight("white", 2),
		new Transform,
		new InfiniteGridHelper(1,2, undefined, 300),
	)
}
