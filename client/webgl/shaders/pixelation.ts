import { DepthTexture, HalfFloatType, MeshBasicMaterial, NearestFilter, RGBAFormat, ShaderMaterial, Vector2, Vector3, Vector4, WebGLRenderer, WebGLRenderTarget, type WebGLDepthBuffer } from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./pixelation.frag?raw"
import { fullscreenQuad } from "../renderer_util";

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

export class PixelPass
{
	get pixelSize() { return this._pixelSize }
	set pixelSize(value: number)
	{
		this._pixelSize = value;
		this.resize(this.resolution.x, this.resolution.y);
	}
	_pixelSize = 2;

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


	render(renderer: WebGLRenderer, color: WebGLRenderTarget, depth: WebGLRenderTarget, depthBuffer: WebGLRenderbuffer, normals: WebGLRenderTarget, out: WebGLRenderTarget | null)
	{
		const _gl = renderer.getContext();
		renderer.autoClear = true
		downsampleMaterial.map = color.texture;
		renderer.setRenderTarget(this.colorRenderTarget);
		fullscreenQuad.render(renderer, downsampleMaterial);

		downsampleMaterial.map = normals.texture;
		renderer.setRenderTarget(this.normalRenderTarget);
		fullscreenQuad.render(renderer, downsampleMaterial);

		downsampleMaterial.map = depth.texture;
		renderer.setRenderTarget(this.depthRenderTarget);
		fullscreenQuad.render(renderer, downsampleMaterial);

		pixelationMaterial.uniforms["u_DiffuseMap"].value = this.colorRenderTarget.texture;
		pixelationMaterial.uniforms["u_DepthMap"].value = this.depthRenderTarget.texture;
		pixelationMaterial.uniforms["u_NormalMap"].value = this.normalRenderTarget.texture;
		renderer.setRenderTarget(out);
		fullscreenQuad.render(renderer, pixelationMaterial);
		renderer.autoClear = false
	}

	resize(width: number, height: number)
	{
		this.resolution.set(width, height);
		this.renderResolution.set((width / this.pixelSize) | 0, (height / this.pixelSize) | 0 );
		const { x, y } = this.renderResolution;
		this.colorRenderTarget.setSize(x, y);
		this.normalRenderTarget.setSize(x, y);
		this.depthRenderTarget.setSize(x, y);
		pixelationMaterial.uniforms["u_Resolution"].value.set(x, y, 1 / x, 1 / y);
	}
}
const downsampleMaterial = new MeshBasicMaterial({
	transparent: true
})
