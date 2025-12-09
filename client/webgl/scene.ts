import { createPrefab } from "elysiatech/ecs";
import { Transform } from "elysiatech/three";
import { globalAssets } from "../assets";

export const scenePrefab = createPrefab(world => {
	return world.createEntityWith(
		new Transform(),
		globalAssets.unwrap("scene").clone(),
	);
})
