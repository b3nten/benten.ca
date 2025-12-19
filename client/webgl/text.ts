import { ActiveCameraComponent, ActorComponent, createPrefab, Transform } from "elysiatech";
import { Text } from 'troika-three-text'
import * as Three from "three"

export const textPrefab = createPrefab(world => {

	const myText = new Text()

	// Set properties to configure:
	myText.text = 'benton'
	myText.fontSize = 6
	myText.position.z = -2
	myText.material = new Three.MeshStandardMaterial({
		color: "white",
		emissive: "white",
		emissiveIntensity: 5,
	})
	myText.sync()

	const vec3 = new Three.Vector3;
	// 24 pixels from top left corner
	const POS_X = 24;
	const POS_Y = 24;
	const TARGET_Z = -20;

	return world.createEntityWith(
		ActorComponent.create({
			update(_, entity, world) {
				const transform = world.getComponent(entity, Transform)!;
				for (const [,,camera] of world.componentIterator(Transform, Three.PerspectiveCamera, ActiveCameraComponent)) {
					const ndcx = (POS_X / window.innerWidth) * 2 - 1;
					const ndcy = -(POS_Y / window.innerHeight) * 2 + 1;

					vec3.set(ndcx, ndcy, 0.5);
					vec3.unproject(camera);

					vec3.sub(camera.position).normalize();

					const t = (TARGET_Z - camera.position.z) / vec3.z;

					const finalX = camera.position.x + t * vec3.x;
					const finalY = camera.position.y + t * vec3.y;

					transform.setPosition(finalX, finalY, TARGET_Z);
					transform.setScale(
						window.innerWidth / 1000,
						window.innerWidth / 1000,
						1
					)

					break
				}
			}
		}),
		new Transform().setPosition(0, 0, -20),
		myText
	)
})
