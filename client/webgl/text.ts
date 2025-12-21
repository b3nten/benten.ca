import {ActiveCameraComponent, ActorComponent, createPrefab, Transform} from "elysiatech";
import {Text} from 'troika-three-text'
import * as Three from "three"
import jersey1oUrl from "../assets/jersey_10.ttf"

export const textPrefab = createPrefab(world => {

    const rootEntity = world.createEntity()

    const bentonEntity = world.createEntity()
    {
        const bentonText = new Text()
        bentonText.text = 'benton'
        bentonText.fontSize = 6
        bentonText.position.z = -2
        bentonText.material = new Three.MeshStandardMaterial({
            color: new Three.Color(50,50,50),
        })
        bentonText.font = jersey1oUrl
        bentonText.sync()

        const vec3 = new Three.Vector3;
        const POS_X = 120;
        const POS_Y = 0;
        const TARGET_Z = -20;

        world.addComponents(bentonEntity,
            ActorComponent.create({
                update(_, entity, world) {
                    const transform = world.getComponent(entity, Transform)!;
                    for (const [, , camera] of world.componentIterator(Transform, Three.PerspectiveCamera, ActiveCameraComponent)) {
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
            bentonText
        )

        world.parent(rootEntity, bentonEntity);
    }

    const blurbEntity = world.createEntity()
    {
        const text = new Text()
        text.text = 'The digital home of\nBenton Boychuk-Chorney'
        text.fontSize = .75
        text.position.z = -2
        text.alignment = 'centred'
        text.material = new Three.MeshStandardMaterial({
            color: "white",
            emissive: "white",
            emissiveIntensity: 10,
        })
        text.font = jersey1oUrl
        text.sync()

        const vec3 = new Three.Vector3;
        const POS_X = window.innerWidth - 600;
        const POS_Y = window.innerHeight - 250;
        const TARGET_Z = -20;

        world.addComponents(blurbEntity,
            ActorComponent.create({
                update(_, entity, world) {
                    const transform = world.getComponent(entity, Transform)!;
                    for (const [, , camera] of world.componentIterator(Transform, Three.PerspectiveCamera, ActiveCameraComponent)) {
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
            text
        )

        world.parent(rootEntity, blurbEntity);
    }

    return rootEntity;
})
