import * as Three from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./bg.frag?raw"
import {Pass} from "three/examples/jsm/postprocessing/Pass.js";
import {ScreenRenderer} from "../renderer_util";

export class BackgroundPass extends Pass
{
	depthTexture: Three.Texture | null = null;
	render(renderer: Three.WebGLRenderer, writeBuffer: Three.WebGLRenderTarget, readBuffer: Three.WebGLRenderTarget, deltaTime: number, maskActive: boolean)
	{
		renderer.setRenderTarget(writeBuffer);
		this.shader.uniforms["u_Diffuse"].value = readBuffer.texture;
		this.shader.uniforms["u_Depth"].value = this.depthTexture;
		ScreenRenderer.render(renderer, this.shader);
	}

	setSize(width: number, height: number) {
		this.shader.uniforms.u_Resolution.value = new Three.Vector2(width, height);
	}

	shader = new Three.ShaderMaterial({
		uniforms: {
			u_Diffuse: { value: null },
			u_Depth: { value: null },
			u_Resolution: { value: null },
			u_MousePos: { value: null },
			u_MouseVelocity: { value: null },
			u_Time: { value: null },
		},
		fragmentShader,
		vertexShader,
	})
}