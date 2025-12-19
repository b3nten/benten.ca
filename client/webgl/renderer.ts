import { Input, type IRenderPipeline, remapRange, type Viewport, World } from "elysiatech";
import * as Three from "three"
import { colorShader } from "./shaders/color";
import { bgShader } from "./shaders/bg";

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
			bgShader.uniforms["u_MousePos"].value = new Three.Vector2(Input.mouseX, Input.mouseY)
			renderer.setRenderTarget(this.bgTarget)
			fullscreenQuad.render(renderer, bgShader)
		}

		// // foreground elements
		{
			renderer.setRenderTarget(this.fgTarget)
			_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, depthRenderBuffer);
			renderer.render(scene, camera);
		}

		// fg normal pass
		{
			scene.overrideMaterial = meshNormalMaterial;
			renderer.setRenderTarget(this.normalTarget)
			_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, depthRenderBuffer);
			renderer.render(scene, camera);
			scene.overrideMaterial = null;
		}

		// fg pixel pass
		{
			scene.overrideMaterial = meshNormalMaterial;
			renderer.setRenderTarget(this.normalTarget)
			_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, depthRenderBuffer);
			renderer.render(scene, camera);
			scene.overrideMaterial = null;
		}

		renderer.setRenderTarget(null);
		_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, null);
		fullscreenQuad.render(renderer, colorShader)
	}

	_onScroll()
	{
		const scrollAmount = remapRange(window.scrollY, 0, window.innerHeight, 0, 1);
		const doubledScrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 4, 0, 1);
		// colorShader.uniforms["u_PixelGranularity"].value = remapRange(scrollAmount, 0, 1, 1, 20)
		colorShader.uniforms["u_Brightness"].value = remapRange(doubledScrollAmount, 1, 0, -2, .065)
	}

	_prepareTargets(renderer: Three.WebGLRenderer, width: number, height: number)
	{
		this.bgTarget.setSize(width, height);
		this.fgTarget.setSize(width, height);
		this.depthTarget.setSize(width, height);
		this.normalTarget.setSize(width, height);
		renderer.setRenderTarget(this.bgTarget)
		renderer.clear();
		renderer.setRenderTarget(this.fgTarget)
		renderer.clear();
		renderer.setRenderTarget(this.normalTarget)
		renderer.clear();
		renderer.setRenderTarget(this.depthTarget)
		renderer.clear();
		renderer.setRenderTarget(null)
	}
}

class FullscreenTriangleGeometry extends Three.BufferGeometry
{
	constructor()
  {
		super();
		this.setAttribute( 'position', new Three.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
		this.setAttribute( 'uv', new Three.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
	}
}

class FullScreenQuad extends Three.Mesh
{
	constructor()
	{
		super(new FullscreenTriangleGeometry(), new Three.ShaderMaterial)
	}

	render(renderer: Three.WebGLRenderer, material: Three.Material)
	{
		this.material = material;
		renderer.render(this, this.#camera);
	}

	#camera = new Three.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 )
}

const fullscreenQuad = new FullScreenQuad();

const depthMaterial = new Three.MeshDepthMaterial({
	depthPacking: Three.BasicDepthPacking
})

const meshNormalMaterial = new Three.MeshNormalMaterial();
meshNormalMaterial.blending = Three.NoBlending;
