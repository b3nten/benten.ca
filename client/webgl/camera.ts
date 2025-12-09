import { createPrefab, ActiveCameraComponent, Transform, Viewport, mustExist, FreeLookComponent } from "elysiatech";
import { PerspectiveCamera } from "three";

const CAMERA_POSITION = [0, 0, 15] as const;
const CAMERA_FOV = 50

export const MainCameraPrefab = createPrefab(world => {
	const viewport = mustExist(world.getSingletonComponent(Viewport));
	return world.createEntityWith(
		new Transform().setPosition(...CAMERA_POSITION),
		new PerspectiveCamera(CAMERA_FOV, viewport.ratio, 0.1, 500),
		new ActiveCameraComponent(),
		new FreeLookComponent
	);
})
