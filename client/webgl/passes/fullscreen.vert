uniform vec2 u_CAOffset;
uniform float u_Aspect;
varying vec2 vUv;
varying float v_CAActive;
varying vec2 v_UvR;
varying vec2 v_UvB;

void main()
{
	vec2 shift = u_CAOffset * vec2(1.0, u_Aspect);
	v_CAActive = (shift.x != 0.0 || shift.y != 0.0) ? 1.0 : 0.0;
	v_UvR = uv + shift;
	v_UvB = uv - shift;
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
