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

vec4 renderBackground() {
	vec4 color;
	vec2 correctedMouse = vec2(u_MousePos.x, u_Resolution.y - u_MousePos.y);

	vec2 pitch = vec2(100.0, 100.0);
	vec2 currentPos = gl_FragCoord.xy;

	float dist = distance(currentPos, correctedMouse);
	float radius = 200.0;

	float mask = smoothstep(radius, 0.0, dist);

	float ripple = sin(u_Time * 40.0 + (currentPos.y * 0.02)) * 3.0;
	float jitter = length(u_MouseVelocity) * 0.4;

	float offset = (ripple + jitter) * mask;

	float offX = currentPos.x + offset;
	float offY = currentPos.y + (offset * 0.5);

	float lineX = mod(offX, pitch.x);
	float lineY = mod(offY, pitch.y);

	if (lineX < 1.0 || lineY < 1.0) {
		float pulse = 0.8 + 0.2 * sin(u_Time * 2.0);
		color = vec4(vec3(1.0) * pulse, 0.7);
	} else {
		color = vec4(0.25, 0.0, 0.65, 1.0);
	}
	return color;
}

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
    vec4 background = renderBackground();
    vec4 foreground = texture2D(u_Diffuse, vUv);

    chromaticAberation(foreground, vUv, foreground);

    vec3 color = mix(background.rgb, foreground.rgb, foreground.a);
    gl_FragColor = vec4(color, 1.);

	vignette(gl_FragColor, vUv, gl_FragColor);
	acesFilmic(gl_FragColor);
	brightnessContrast(gl_FragColor, vUv, gl_FragColor);
}
