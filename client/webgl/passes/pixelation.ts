import {
	DepthTexture,
	HalfFloatType,
	MeshBasicMaterial,
	NearestFilter,
	RGBAFormat,
	ShaderMaterial,
	Vector2,
	Vector4,
	WebGLRenderer,
	WebGLRenderTarget,
	Texture
} from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./pixelation.frag?raw"
import { ScreenRenderer } from "../renderer_util";
import {Pass} from "three/examples/jsm/postprocessing/Pass.js";

export class PixelPass extends Pass
{
	get pixelSize() { return this._pixelSize }
	set pixelSize(value: number)
	{
		this._pixelSize = value;
		this.setSize(this.resolution.x, this.resolution.y);
	}
	_pixelSize = 1;

	resolution = new Vector2
	renderResolution = new Vector2

	colorRenderTarget = new WebGLRenderTarget(1, 1, {
		depthBuffer: true,
   		stencilBuffer: false,
    	format: RGBAFormat,
    	type: HalfFloatType,
    	minFilter: NearestFilter,
		magFilter: NearestFilter,
		depthTexture: new DepthTexture(1,1),
	})

	depthRenderTarget = new WebGLRenderTarget(1, 1, {
		depthBuffer: true,
   		stencilBuffer: false,
    	format: RGBAFormat,
    	type: HalfFloatType,
    	minFilter: NearestFilter,
		magFilter: NearestFilter,
		depthTexture: new DepthTexture(1,1),
	})

	normalRenderTarget = new WebGLRenderTarget(1, 1, {
		depthBuffer: true,
   		stencilBuffer: false,
    	format: RGBAFormat,
    	type: HalfFloatType,
    	minFilter: NearestFilter,
		magFilter: NearestFilter,
		depthTexture: new DepthTexture(1,1),
	})

	prerender(renderer: WebGLRenderer, color: Texture, depth: Texture, normals: Texture)
	{
		this.downsampleMaterial.map = color;
		renderer.setRenderTarget(this.colorRenderTarget);
		ScreenRenderer.render(renderer, this.downsampleMaterial);

		this.downsampleMaterial.map = normals;
		renderer.setRenderTarget(this.normalRenderTarget);
		ScreenRenderer.render(renderer, this.downsampleMaterial);

		this.downsampleMaterial.map = depth;
		renderer.setRenderTarget(this.depthRenderTarget);
		ScreenRenderer.render(renderer, this.downsampleMaterial);
	}

	render(renderer: WebGLRenderer, out: WebGLRenderTarget)
	{
		pixelationMaterial.uniforms["u_DiffuseMap"].value = this.colorRenderTarget.texture;
		pixelationMaterial.uniforms["u_DepthMap"].value = this.depthRenderTarget.texture;
		pixelationMaterial.uniforms["u_NormalMap"].value = this.normalRenderTarget.texture;
		renderer.setRenderTarget(out);
		ScreenRenderer.render(renderer, pixelationMaterial);
	}

	setSize(width: number, height: number)
	{
		this.resolution.set(width, height);
		this.renderResolution.set((width / this.pixelSize) | 0, (height / this.pixelSize) | 0 );
		const { x, y } = this.renderResolution;
		this.colorRenderTarget.setSize(x, y);
		this.normalRenderTarget.setSize(x, y);
		this.depthRenderTarget.setSize(x, y);
		pixelationMaterial.uniforms["u_Resolution"].value.set(x, y, 1 / x, 1 / y);
	}

	downsampleMaterial = new MeshBasicMaterial({ transparent: true })
}

const pixelationMaterial = new ShaderMaterial({
	uniforms: {
		u_DiffuseMap: { value: null },
		u_DepthMap: { value: null },
		u_NormalMap: { value: null },
		u_Resolution: { value: new Vector4() },
		u_NormalEdgeStrength: { value: 1 },
		u_DepthEdgeStrength: { value: .5 }
	},
	vertexShader,
	fragmentShader,
})

