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

export const fullscreenQuad = new FullScreenQuad();
