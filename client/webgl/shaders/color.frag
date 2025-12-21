#include <tonemapping_pars_fragment>

uniform sampler2D u_Diffuse;

uniform vec2 u_CAOffset;
uniform float u_VignetteOffset;
uniform float u_VignetteDarkness;
uniform float u_Brightness;
uniform float u_Contrast;
uniform vec2 u_Resolution;
uniform vec2 u_MousePos;
uniform vec2 u_MouseVelocity;
uniform float u_Time;

varying vec2 vUv;
varying float v_CAActive;
varying vec2 v_UvR;
varying vec2 v_UvB;

void chromaticAberation(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec2 ra = inputColor.ra;
	vec2 ba = inputColor.ba;
	if(v_CAActive > 0.0) {
		ra = texture2D(u_Diffuse, v_UvR).ra;
		ba = texture2D(u_Diffuse, v_UvB).ba;
	}
	outputColor = vec4(ra.x, inputColor.g, ba.x, max(max(ra.y, ba.y), inputColor.a));
}

void vignette(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{
	const vec2 center = vec2(0.5);
	vec3 color = inputColor.rgb;
	float d = distance(uv, center);
	color *= smoothstep(0.8, u_VignetteOffset * 0.799, d * (u_VignetteDarkness + u_VignetteOffset));
	outputColor = vec4(color, inputColor.a);
}

void brightnessContrast(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec3 color = inputColor.rgb + vec3(u_Brightness - 0.5);
	if(u_Contrast > 0.0) {
		color /= vec3(1.0 - u_Contrast);
	} else {
		color *= vec3(1.0 + u_Contrast);
	}
	outputColor = vec4(color + vec3(0.5), inputColor.a);
}

void acesFilmic(inout vec4 outputColor) {
	outputColor = vec4(toneMapping(outputColor.rgb), outputColor.a);
}

void main()
{
    vec4 foreground = texture2D(u_Diffuse, vUv);
    chromaticAberation(foreground, vUv, gl_FragColor);
	vignette(gl_FragColor, vUv, gl_FragColor);
	acesFilmic(gl_FragColor);
	brightnessContrast(gl_FragColor, vUv, gl_FragColor);
}
