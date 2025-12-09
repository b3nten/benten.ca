import { createPrefab, ActiveCameraComponent, Transform, Viewport, mustExist } from "elysiatech";
import { PerspectiveCamera } from "three";

const CAMERA_POSITION = [5, 7, 11] as const;
const CAMERA_ROTATION = [-0.25, 0.16, 0.04, 0.95] as const;
const CAMERA_FOV = 50

export const cameraPrefab = createPrefab(world => {
	const viewport = mustExist(world.getSingletonComponent(Viewport));
	return world.createEntityWith(
		new Transform().setPosition(...CAMERA_POSITION).setRotation(...CAMERA_ROTATION),
		new PerspectiveCamera(CAMERA_FOV, viewport.ratio, 0.1, 500),
		new ActiveCameraComponent(),
	);
})
