precision highp float;

varying vec2 vUv;
uniform vec2 u_Resolution;
uniform vec2 u_MousePos;

void main() {
	vec2 offset = vec2(0.0, 0.0);
	vec2 pitch = vec2(100.0, 100.0);

  float lX = gl_FragCoord.x / u_Resolution.x;
  float lY = gl_FragCoord.y / u_Resolution.y;

  float scaleFactor = 10000.0;

  float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
  float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);

  // apply cursor effect
  float distX = gl_FragCoord.x - u_MousePos.x;
	float distY = gl_FragCoord.y - u_MousePos.y;
	float dist = sqrt(distX * distX + distY * distY);
	float cursorEffect = exp(-dist * 0.01);

	offX += cursorEffect * 50.0;

  if (int(mod(offX, pitch[0])) == 0 || int(mod(offY, pitch[1])) == 0) {
    gl_FragColor = vec4(1., 1., 1., .7);
  } else {
    gl_FragColor = vec4(0., 0., .65, 1.0);
  }
}
