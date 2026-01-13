import { mustExist, remapRange, Transform, Viewport, World } from "elysiatech";
import * as Three from "three";
import { MainCameraPrefab } from "./camera";
import {
  ComputerMovementSystem,
  createComputerPrefabFactory,
  ResizeBallComponent,
} from "./computers";
import { PointerMovementSystem, PointerPrefab } from "./pointer";
import { ColliderComponent, PhysicsSystem } from "./physics";
import { textPrefab } from "./text";

export function webglEntry(world: World) {
  // setup systems

  world.addSystem(PhysicsSystem, { x: 0, y: -9.81, z: 0 });
  world.addSystem(ComputerMovementSystem);
  world.addSystem(PointerMovementSystem);

  // prefabs

  const viewport = mustExist(world.getSingletonComponent(Viewport));

  const SCALE_FACTOR = remapRange(viewport.width, 400, 1400, 0.8, 1.2);

  world.addPrefabs(
    MainCameraPrefab,
    PointerPrefab,
    textPrefab,
    ...Array.from({ length: 100 })
      .map(() => ({
        scale:
          [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)] *
          SCALE_FACTOR,
      }))
      .map(createComputerPrefabFactory()),
  );

  // ball collider

  world.createEntityWith(
    new Transform(),
    new ColliderComponent(rapier.ColliderDesc.ball(0.5)),
    new ResizeBallComponent(),
  );

  // lights

  world.createEntityWith(
    new Transform().setPosition(0, -5, 0),
    new Three.PointLight("#FFEDFE", 20),
  );

  world.createEntityWith(
    new Transform().setPosition(0, 0, 10),
    new Three.PointLight("#FFEDFE", 5),
  );

  world.createEntityWith(
    new Three.AmbientLight("#FFEDFE", 2),
    new Three.PointLight("#FFEDFE", 30),
    new Transform().setPosition(0, 5, 0),
  );
}
