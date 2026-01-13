import { System, ActiveCameraComponent, Transform, assert } from "elysiatech";
import { PerspectiveCamera, WebGLRenderer } from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

export class MapControlCameraSystem extends System {
  camera = new PerspectiveCamera();
  controls: MapControls | undefined;

  startup() {
    this.controls = new MapControls(
      this.camera,
      this.world.getSingletonComponent(WebGLRenderer)!.domElement,
    );
    this.controls.enableDamping = true;
    // this.controls.enableRotate = false;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 5;

    for (const [, transform] of this.world.componentIterator(
      Transform,
      ActiveCameraComponent,
    )) {
      this.camera.position.copy(transform.position);
      this.camera.quaternion.copy(transform.rotation);
    }
    this.controls.update();
  }

  update(frametime: number) {
    assert(this.controls);
    this.controls.update(frametime);
    for (const [, transform] of this.world.componentIterator(
      Transform,
      ActiveCameraComponent,
    )) {
      transform.position.copy(this.camera.position);
      transform.rotation.copy(this.camera.quaternion);
    }
  }
}
