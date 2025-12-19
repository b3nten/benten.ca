import { ShaderMaterial, Vector4 } from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./pixelation.frag?raw"

export const pixelationMaterial = new ShaderMaterial({
	uniforms: {
		u_DiffuseMap: { value: null },
		u_DepthMap: { value: null },
		u_NormalMap: { value: null },
		u_Resolution: { value: new Vector4() },
		u_NormalEdgeStrength: { value: 0 },
		u_DepthEdgeStrength: { value: 0 }
	},
	vertexShader,
	fragmentShader,
})
