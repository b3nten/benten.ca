import { ShaderMaterial } from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./bg.frag?raw"

export const bgShader = new ShaderMaterial({
	uniforms: {
		u_Resolution: { value: null },
		u_MousePos: { value: null },
	},
	fragmentShader,
	vertexShader,
})
