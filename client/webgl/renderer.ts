import { Input, type IRenderPipeline, remapRange, type Viewport, World } from "elysiatech";
import * as Three from "three"
import { colorShader } from "./shaders/color";
import { bgShader } from "./shaders/bg";
import { fullscreenQuad } from "./renderer_util";
import { PixelPass } from "./shaders/pixelation";

const renderTargetOptions = {
  depthBuffer: false,
  stencilBuffer: false,
  format: Three.RGBAFormat,
  type: Three.UnsignedByteType,
}

export class CustomRenderPipeline implements IRenderPipeline {
	world?: World;

	depthTarget = new Three.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
   depthBuffer: true,
   stencilBuffer: false,
   format: Three.RGBAFormat,
	 type: Three.UnsignedByteType,
 	});

	normalTarget = new Three.WebGLRenderTarget(1, 1, {
		...renderTargetOptions,
		minFilter: Three.NearestFilter,
		magFilter: Three.NearestFilter,
		type: Three.HalfFloatType
	});

	bgTarget = new Three.WebGLRenderTarget(1, 1, { ...renderTargetOptions });

	fgTarget = new Three.WebGLRenderTarget(1, 1, { ...renderTargetOptions });

	fg2Target = new Three.WebGLRenderTarget(1, 1, { ...renderTargetOptions });

	pixelPass = new PixelPass

	createRenderer(canvas: HTMLCanvasElement): Three.WebGLRenderer
	{
		return new Three.WebGLRenderer({
			canvas,
			antialias: false,
			powerPreference: "high-performance",
			precision: "highp",
			alpha: true,
			depth: false,
			stencil: false,
		})
	}

	configure = (renderer: Three.WebGLRenderer): void =>
	{
		window.addEventListener("scroll", this._onScroll.bind(this))

		renderer.setPixelRatio(1)
		renderer.info.autoReset = false;
		renderer.toneMapping = Three.NoToneMapping;
		renderer.autoClear = false;
		renderer.autoClearDepth = false;

		colorShader.uniforms["u_BackgroundMap"].value = this.bgTarget.texture
		colorShader.uniforms["u_Map0"].value = this.fgTarget.texture
	}

	render = (_: number, scene: Three.Scene, camera: Three.Camera, renderer: Three.WebGLRenderer, viewport: Viewport): void =>
	{
		this._prepareTargets(renderer, viewport.width, viewport.height)
		camera.layers.set(0)
		const _gl = renderer.getContext();

		// depth
		{
			// renderer.setRenderTarget(null)
			renderer.setRenderTarget(this.depthTarget)
			scene.overrideMaterial = depthMaterial;
			renderer.render(scene, camera);
			scene.overrideMaterial = null;
			// return;
		}

		let renderBufferProps = renderer.properties.get(this.depthTarget) as any;
		let depthRenderBuffer: WebGLRenderbuffer = renderBufferProps.__webglDepthRenderbuffer || renderBufferProps.__webglDepthbuffer;

		// background
		{
			bgShader.uniforms["u_Resolution"].value = new Three.Vector2(viewport.width, viewport.height);
			bgShader.uniforms["u_MouseVelocity"].value = new Three.Vector2(Input.mouseDeltaX, Input.mouseDeltaY);
			bgShader.uniforms["u_MousePos"].value = new Three.Vector2(Input.mouseX, Input.mouseY)
			bgShader.uniforms["u_Time"].value = performance.now() * 0.001;
			renderer.setRenderTarget(this.bgTarget)
			fullscreenQuad.render(renderer, bgShader)
		}

		// fg normal pass
		{
			scene.overrideMaterial = meshNormalMaterial;
			renderer.setRenderTarget(this.normalTarget)
			_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, depthRenderBuffer);
			renderer.render(scene, camera);
			scene.overrideMaterial = null;
		}

		// foreground elements
		{
			renderer.setRenderTarget(this.fg2Target)
			_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, depthRenderBuffer);
			renderer.render(scene, camera);
		}

		// fg pixel pass
		{
			renderer.setRenderTarget(this.fgTarget)
			this.pixelPass.resize(viewport.width, viewport.height);
			this.pixelPass.render(renderer, this.fg2Target, this.depthTarget, depthRenderBuffer, this.normalTarget, this.fgTarget);
		}

		renderer.setRenderTarget(null);
		fullscreenQuad.render(renderer, colorShader)
	}

	_onScroll()
	{
		const scrollAmount = remapRange(window.scrollY, 0, window.innerHeight, 0, 1);
		const doubledScrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 4, 0, 1);
		this.pixelPass.pixelSize = remapRange(scrollAmount, 0, 1, 2, 10)
		colorShader.uniforms["u_Brightness"].value = remapRange(doubledScrollAmount, 1, 0, -2, .065)
	}

	_prepareTargets(renderer: Three.WebGLRenderer, width: number, height: number)
	{
		this.bgTarget.setSize(width, height);
		this.fgTarget.setSize(width, height);
		this.depthTarget.setSize(width, height);
		this.normalTarget.setSize(width, height);
		this.fg2Target.setSize(width, height);
		renderer.setRenderTarget(this.bgTarget)
		renderer.clear();
		renderer.setRenderTarget(this.fgTarget)
		renderer.clear();
		renderer.setRenderTarget(this.normalTarget)
		renderer.clear();
		renderer.setRenderTarget(this.depthTarget)
		renderer.clear();
		renderer.setRenderTarget(this.fg2Target)
		renderer.clear();
		renderer.setRenderTarget(null)
	}
}



const depthMaterial = new Three.MeshDepthMaterial({
	depthPacking: Three.BasicDepthPacking
})

const meshNormalMaterial = new Three.MeshNormalMaterial();
meshNormalMaterial.blending = Three.NoBlending;
