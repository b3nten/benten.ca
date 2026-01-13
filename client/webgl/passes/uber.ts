import {
  ACESFilmicToneMapping,
  ShaderMaterial,
  Vector2,
  type WebGLRenderer,
  type WebGLRenderTarget,
} from "three";
import vertexShader from "./fullscreen.vert?raw";
import fragmentShader from "./uber.frag?raw";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { ScreenRenderer } from "../renderer_util";

export class UberShaderPass extends Pass {
  setSize(width: number, height: number) {
    this.shader.uniforms.u_Aspect.value = width / height;
    this.shader.uniforms.u_Resolution.value = new Vector2(width, height);
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget,
  ) {
    renderer.setRenderTarget(writeBuffer);
    this.shader.uniforms.u_Diffuse.value = readBuffer.texture;
    ScreenRenderer.render(renderer, this.shader);
  }

  shader = new ShaderMaterial({
    uniforms: {
      u_Diffuse: { value: null },
      u_VignetteOffset: { value: 0.2 },
      u_VignetteDarkness: { value: 0.7 },
      u_Brightness: { value: 0.05 },
      u_Contrast: { value: 0.15 },
      u_ToneMappingMode: { value: ACESFilmicToneMapping },
      toneMappingExposure: { value: 1.1 },
      u_CAOffset: { value: new Vector2(1e-3, 5e-4) },
      u_Aspect: { value: window.innerWidth / window.innerHeight },
      u_Resolution: { value: null },
      u_MousePos: { value: null },
      u_MouseVelocity: { value: null },
      u_Time: { value: null },
    },
    defines: {
      "toneMapping(texel)": "ACESFilmicToneMapping(texel)",
    },
    fragmentShader,
    vertexShader,
  });
}
