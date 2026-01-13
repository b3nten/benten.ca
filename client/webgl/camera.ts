import {
  createPrefab,
  ActiveCameraComponent,
  Transform,
  Viewport,
  mustExist,
  FreeLookComponent,
  ActorComponent,
} from "elysiatech";
import { PerspectiveCamera, Euler } from "three";

const CAMERA_POSITION = [0, 0, 15] as const;
const CAMERA_FOV = 50;

export const MainCameraPrefab = createPrefab((world) => {
  const viewport = mustExist(world.getSingletonComponent(Viewport));
  return world.createEntityWith(
    new Transform().setPosition(...CAMERA_POSITION),
    new PerspectiveCamera(CAMERA_FOV, viewport.ratio, 1, 500),
    new ActiveCameraComponent(),
    new FreeLookComponent(),
    // rotate camera to face the footer scene
    ActorComponent.create({
      update(delta, entity, world) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollAmount = window.scrollY;
        const transform = world.getComponent(entity, Transform)!;
        if (scrollAmount < scrollHeight / 2) {
          transform.rotation.set(0, 0, 0, 0);
        } else {
          transform.rotation.setFromEuler(new Euler(0, Math.PI / 2, 0));
        }
      },
    }),
  );
});
