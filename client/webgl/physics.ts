
import Rapier from "@dimforge/rapier3d";
import { mustExist, System, Transform, World, type Component, type EntityID } from "elysiatech";

let rapierInstance = null as unknown as typeof Rapier;

declare global
{
	var rapier: typeof Rapier
}

Object.defineProperty(window, "rapier", {
	get() { return mustExist(rapierInstance) },
	configurable: false,
	enumerable: false,
})

export const loadRapier = () =>
  import("@dimforge/rapier3d").then((R) => (rapierInstance = R));

export class RigidBodyComponent implements Component
{
	config: Rapier.RigidBodyDesc;
  constructor(config: Rapier.RigidBodyDesc)
  {
  	this.config = config;
  }

  /** @internal */
  get impl(): Rapier.RigidBody | null
  {
    if (!this._world || this._handle === null) return null;
    return this._world.getRigidBody(this._handle);
  }
  /** @internal */
  _handle: Rapier.RigidBodyHandle | null = null;
  /** @internal */
  _world: Rapier.World | null = null;
}

export class ColliderComponent implements Component
{
	config: Rapier.ColliderDesc;

  constructor(config: Rapier.ColliderDesc)
  {
  	this.config = config;
  }

  /** @internal */
  get impl(): Rapier.Collider | null
  {
    if (!this._world || this._handle === null) return null;
    return this._world.getCollider(this._handle);
  }
  /** @internal */
  _handle: Rapier.ColliderHandle | null = null;
  /** @internal */
  _world: Rapier.World | null = null;
}

export class PhysicsSystem extends System
{
  physicsWorld: Rapier.World;

  constructor(...args: ConstructorParameters<typeof Rapier.World>)
  {
    super();
    this.physicsWorld = new rapier.World(...args);
    this.whenShutdown(
      this.world.onComponentAdded(RigidBodyComponent, this.createPhysicsObject),
      this.world.onComponentRemoved(
        RigidBodyComponent,
        this.removePhysicsObject,
      ),
      this.world.onComponentAdded(ColliderComponent, this.createPhysicsObject),
      this.world.onComponentRemoved(
        ColliderComponent,
        this.removePhysicsObject,
      ),
      this.world.onComponentAdded(Transform, this.createPhysicsObject),
      this.world.onComponentRemoved(Transform, this.removePhysicsObject),
    );
  }

  startup()
  {
    this.updateRigidBodyPositions();
  }

  update()
  {
    this.physicsWorld.step();
    this.updateEntityTransforms();
  }

  protected updateRigidBodyPosition(transform: Transform, body: Rapier.RigidBody)
  {
    body.setTranslation(transform.position, true);
    body.setRotation(transform.rotation, true);
  }

  protected updateRigidBodyPositions()
  {
    for (const [, rigidBodyComponent, transform] of this.world.componentIterator(RigidBodyComponent, Transform)) {
      this.updateRigidBodyPosition(transform, rigidBodyComponent.impl!);
    }
  }

  protected updateEntityTransform(transform: Transform, body: Rapier.RigidBody)
  {
    transform.position.copy(body.translation());
    transform.rotation.copy(body.rotation());
  }

  // update transforms from physics to scene
  protected updateEntityTransforms()
  {
    for (const [_, rigidBodyComponent, transform] of this.world.componentIterator(RigidBodyComponent, Transform))
    {
      this.updateEntityTransform(transform, rigidBodyComponent.impl!);
    }
  }

  protected createPhysicsObject = (_: World, entity: EntityID, c: Component) =>
  {
    const transform = this.world.getComponent(entity, Transform);
    if (!transform) return;
    if (c instanceof RigidBodyComponent)
    {
      const r = this.physicsWorld.createRigidBody(c.config);
      c._handle = r.handle;
      c._world = this.physicsWorld;
      // add collider if exists
      const colliderComponent = this.world.getComponent(
        entity,
        ColliderComponent,
      );
      if (colliderComponent) {
        if (colliderComponent.impl !== null) {
          this.physicsWorld.removeCollider(colliderComponent.impl!, false);
        }
        this.createPhysicsObject(this.world, entity, colliderComponent);
      }
      this.updateRigidBodyPosition(transform, r);
    } else if (c instanceof ColliderComponent) {
      const rbody = this.world.getComponent(entity, RigidBodyComponent);
      const collider = this.physicsWorld.createCollider(
        c.config,
        rbody?.impl ?? undefined,
      );
      c._handle = collider.handle;
      c._world = this.physicsWorld;
    }
  };

  protected removePhysicsObject = (_: World, entity: EntityID, c: Component) =>
  {
    let rigidBody: RigidBodyComponent | null = null;
    let collider: ColliderComponent | null = null;
    if (c instanceof Transform)
    {
      rigidBody = this.world.getComponent(entity, RigidBodyComponent);
      collider = this.world.getComponent(entity, ColliderComponent);
    }
    else if (c instanceof RigidBodyComponent)
    {
      rigidBody = c;
      collider = this.world.getComponent(entity, ColliderComponent);
    }
    else if (c instanceof ColliderComponent)
    {
      collider = c;
      rigidBody = this.world.getComponent(entity, RigidBodyComponent);
    }
    if (collider && collider.impl !== null)
    {
      this.physicsWorld.removeCollider(collider.impl, true);
      collider._handle = null;
      collider._world = null;
    }
    if (rigidBody && rigidBody.impl !== null)
    {
      this.physicsWorld.removeRigidBody(rigidBody.impl);
      rigidBody._handle = null;
      rigidBody._world = null;
    }
  };
}
