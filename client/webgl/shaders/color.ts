import { ACESFilmicToneMapping, ShaderMaterial, Vector2 } from "three";
import vertexShader from "./fullscreen.vert?raw"
import fragmentShader from "./color.frag?raw"

export const colorShader = new ShaderMaterial({
	uniforms: {
		u_Map0: { value: null },
		u_Map1: { value: null },
		u_BackgroundMap: { value: null },
		u_VignetteOffset: { value: 0.2 },
		u_VignetteDarkness: { value: 0.7 },
		u_Brightness: { value: 0.05 },
		u_Contrast: { value: 0.15 },
		u_ToneMappingMode: { value: ACESFilmicToneMapping },
		toneMappingExposure: { value: 1.1 },
		u_CAOffset: { value: new Vector2(1e-3, 5e-4) },
		u_Aspect: { value: window.innerWidth / window.innerHeight },
	},
	defines: {
		"toneMapping(texel)": "ACESFilmicToneMapping(texel)"
	},
	fragmentShader,
	vertexShader,
})
