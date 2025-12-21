import {Pass} from "three/examples/jsm/postprocessing/Pass.js";
import * as Three from "three";
import {assert} from "elysiatech/lib";

export class Prepass extends Pass {
    depthTarget = new Three.WebGLRenderTarget(1, 1, {
        depthBuffer: true,
        stencilBuffer: false,
        format: Three.RGBAFormat,
        type: Three.UnsignedByteType,
        depthTexture: new Three.DepthTexture(1, 1, Three.UnsignedShortType),
        resolveDepthBuffer: true,
    });

    get depthTexture() {
        return this.depthTarget.depthTexture!
    }

    get normalTexture() {
        return this.depthTarget.texture
    }

    scene?: Three.Scene;
    camera?: Three.Camera
    material = new Three.MeshNormalMaterial();

    update(scene: Three.Scene, camera: Three.Camera) {
        this.scene = scene;
        this.camera = camera;
    }

    render(renderer: Three.WebGLRenderer) {
        assert(this.scene, "Prepass: No scene set for prepass");
        assert(this.camera, "Prepass: No camera set for prepass");

        renderer.setRenderTarget(this.depthTarget);
        renderer.clear();

        const previousOverrideMaterial = this.scene.overrideMaterial;
        this.scene.overrideMaterial = this.material;

        renderer.render(this.scene, this.camera);

        this.scene.overrideMaterial = previousOverrideMaterial;
    }

    setSize(width: number, height: number) {
        this.depthTarget.setSize(width, height);
    }
}