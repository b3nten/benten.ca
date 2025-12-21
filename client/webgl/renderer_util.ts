import * as Three from "three"

export class FullscreenTriangleGeometry extends Three.BufferGeometry
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

export const ScreenRenderer = new FullScreenQuad();

export class SwapChain {

    get readable() {
        return this._target0;
    }

    get writable() {
        return this._target1;
    }

    constructor() {
        this._target0 = new Three.WebGLRenderTarget(1, 1, {
            depthBuffer: true,
            stencilBuffer: false,
            format: Three.RGBAFormat,
            type: Three.UnsignedByteType,
        });
        this._target1 = this._target0.clone();
    }

    setSize(width: number, height: number) {
        this._target0.setSize(width, height);
        this._target1.setSize(width, height);
    }

    swap() {
        const temp = this._target0;
        this._target0 = this._target1;
        this._target1 = temp;
    }

    _target0: Three.WebGLRenderTarget;
    _target1: Three.WebGLRenderTarget
}