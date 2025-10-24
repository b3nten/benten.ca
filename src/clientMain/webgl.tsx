import * as Three from "three";
import {
  ActiveCameraComponent,
  RendererComponent,
  SceneComponent,
  ThreeObjectSystem,
  ThreeRenderSystem,
  Transform,
  Viewport,
  FreeLookComponent,
  FreeLookControlSystem,
  InfiniteGridHelper,
} from "@100x/engine/three";
import { ActorSystem, ActorComponent, World } from "@100x/engine/ecs";
import { Frameloop } from "@100x/engine/lib";
import { nonNullOrThrow, assert } from "@100x/engine/asserts";
import { useEffect } from "react";
import { System } from "@100x/engine/ecs";

abstract class BackgroundShaderComponent {
  get renderTarget() {
    return this.#renderTarget;
  }

  get material() {
    return this.#shader;
  }

  vertexShader: string = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  abstract fragmentShader: string;

  get baseUniforms() {
    return {
      time: { value: 0 },
      delta: { value: 0 },
      resolution: {
        value: new Three.Vector2(window.innerWidth, window.innerHeight),
      },
    };
  }

  abstract uniforms: Record<string, Three.IUniform>;

  #scene = new Three.Scene();
  #camera = new Three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  #shader?: Three.ShaderMaterial;
  #renderTarget = new Three.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
  );
  #previousViewportDimensions = new Three.Vector2();

  startup() {
    this.#shader = new Three.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
    });

    this.#scene.add(
      new Three.Mesh(new Three.PlaneGeometry(2, 2), this.#shader),
    );

    this.#camera.position.set(0, 0, 1);
    this.#camera.lookAt(new Three.Vector3(0, 0, 0));
    this.#camera.updateProjectionMatrix();
    this.#camera.updateMatrixWorld();
  }

  /** Subclasses can override to animate uniforms etc. */
  update(delta: number) {}

  draw(delta: number, renderer: Three.WebGLRenderer) {
    this.#updateUniforms(delta, renderer);
    this.update(delta);
    const previousRenderTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(this.#renderTarget);
    renderer.render(this.#scene, this.#camera);
    renderer.setRenderTarget(previousRenderTarget);
  }

  shutdown() {
    this.#renderTarget.dispose();
    this.#shader?.dispose();
    this.#scene.clear();
  }

  setUniform(name: string, value: any) {
    if (this.uniforms[name]) this.uniforms[name].value = value;
  }

  #updateUniforms(delta: number, renderer: Three.WebGLRenderer) {
    const size = new Three.Vector2();
    renderer.getSize(size);
    const pixelRatio = renderer.getPixelRatio();
    size.multiplyScalar(pixelRatio);

    if (
      this.#previousViewportDimensions.x !== size.x ||
      this.#previousViewportDimensions.y !== size.y
    ) {
      this.#renderTarget.setSize(size.x, size.y);
      this.uniforms.resolution.value.set(size.x, size.y);
      this.#previousViewportDimensions.copy(size);
    }
    this.uniforms.delta.value = delta;
    this.uniforms.time.value += delta;
  }
}

class CoolShader extends BackgroundShaderComponent {
  uniforms: Record<string, Three.IUniform<any>> = {
    ...this.baseUniforms,
  };

  override update(delta: number): void {
    console.log(this.uniforms);
  }

  fragmentShader = /* glsl */ `
    uniform float time;
    uniform float delta;
    uniform vec2 resolution;

    // Convert HSV to RGB
    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                       0.0, 1.0);
      rgb = rgb * rgb * (3.0 - 2.0 * rgb);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv -= 0.5;
      uv.x *= resolution.x / resolution.y; // keep aspect ratio

      float t = time * 0.3;

      // Layered sin waves
      float wave = sin(uv.x * 4.0 + t) + sin(uv.y * 3.0 - t * 1.3);
      wave += sin((uv.x + uv.y) * 2.5 + t * 0.8);
      wave *= 0.33;

      // Map wave to hue
      vec3 color = hsv2rgb(vec3(0.6 + 0.3 * wave + t * 0.05, 0.8, 1.0));

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

export function webgl() {
  const canvas = nonNullOrThrow(
    document.getElementById("viewport") as HTMLCanvasElement,
  );

  const world = new World();

  world.addSystem(FreeLookControlSystem);
  world.addSystem(ActorSystem);
  world.addSystem(ThreeObjectSystem);
  world.addSystem(
    class BackgroundShaderSystem extends System {
      shader = new CoolShader();
      startup(): void {
        this.shader.startup();
        const scene = this.world.resolveComponent(SceneComponent)?.value;
        assert(scene, "SceneComponent not found");
        scene.background = this.shader.renderTarget.texture;
      }
      update(delta: number): void {
        const renderer = this.world.resolveComponent(RendererComponent)?.value;
        assert(renderer, "RendererComponent not found");
        this.shader.draw(delta, renderer);
      }
    },
  );
  world.addSystem(ThreeRenderSystem);

  // "scene" entity
  world.createEntityWith(
    Viewport.fullScreenCanvas(canvas),
    new RendererComponent(new Three.WebGLRenderer({ canvas })),
    new SceneComponent(new Three.Scene()),
    // new Three.AmbientLight(0xffffff, 0.1),
    new InfiniteGridHelper(),
    new Transform(),
  );

  world.createEntityWith(
    new Transform(),
    new Three.Mesh(
      new Three.BoxGeometry(1, 1, 1),
      new Three.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
      }),
    ),
    // utility method to create a single instance actor
    ActorComponent.create({
      update(deltaTime, entity, world) {
        const transform = world.getComponent(entity, Transform)!;
        transform.rotation.setFromAxisAngle(
          Transform.xAxis,
          performance.now() * 0.001,
        );
      },
    }),
  );

  // camera entity
  world.createEntityWith(
    new Transform().setPosition(0, 0, 5),
    new Three.PerspectiveCamera(75, devicePixelRatio, 0.1, 1000),
    new ActiveCameraComponent(),
    new FreeLookComponent(),
  );

  // skybox
  world.createEntityWith(
    new Transform().setPosition(0, 0, 0).setScaleScalar(100),
    new Three.Mesh(
      new Three.BoxGeometry(1, 1, 1),
      new Three.ShaderMaterial({
        side: Three.BackSide,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;

          // Convert HSV to RGB
          vec3 hsv2rgb(vec3 c) {
            vec3 rgb = clamp(
              abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
              0.0,
              1.0
            );
            rgb = rgb * rgb * (3.0 - 2.0 * rgb);
            return c.z * mix(vec3(1.0), rgb, c.y);
          }

          void main() {
            // Use position or normal to generate wave pattern
            vec3 uv = normalize(vNormal); // range roughly -1..1

            // Simple wave pattern based on normals
            float wave = sin(uv.x * 4.0) + sin(uv.y * 3.0) + sin((uv.x + uv.y) * 2.5);
            wave *= 0.33;

            // Map wave to hue
            vec3 color = hsv2rgb(vec3(0.6 + 0.3 * wave, 0.8, 1.0));

            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    ),
  );

  world.startup();
  const fl = new Frameloop(world.update);
  return () => {
    world.shutdown();
    fl.stop();
  };
}

export function WebGL() {
  useEffect(webgl, []);
  return <canvas className="w-screen h-screen" id="viewport" />;
}
