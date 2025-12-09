
import { createPrefab, Input, lerp, mustExist, System, Transform, Viewport, type Component } from "elysiatech";
import { ColliderComponent, RigidBodyComponent } from "./physics";
import { Vector3 } from "three";

export const PointerPrefab = createPrefab((world) => {
  const transform = new Transform().setPositionScalar(100);
  const pc = new PointerComponent();
  const rb = new RigidBodyComponent(rapier.RigidBodyDesc.kinematicPositionBased());
  const collider = new ColliderComponent(rapier.ColliderDesc.ball(2));
  return world.createEntityWith(transform, pc, rb, collider);
});

class PointerComponent implements Component {}

export class PointerMovementSystem extends System
{
  update()
  {
    let viewport = mustExist(this.world.getSingletonComponent(Viewport));

    for (const [, , rbody] of this.world.componentIterator(PointerComponent, RigidBodyComponent))
    {
      const rb = rbody.impl;
      if (!rb) continue;

      const ndcX = (Input.mouseX / viewport.width) * 2 - 1;
      const ndcY = -(Input.mouseY / viewport.height) * 2 + 1;

      this.vec.x = lerp(this.vec.x, (ndcX * (viewport.width * 0.01)) / 2, 0.8);
      this.vec.y = lerp(this.vec.y, (ndcY * (viewport.height * 0.01)) / 2, 0.8);

      rb.setNextKinematicTranslation(this.vec);
    }
  }

  private vec = new Vector3(0, 0, 0);
}
