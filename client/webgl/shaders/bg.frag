precision highp float;

varying vec2 vUv;
uniform vec2 u_Resolution;
uniform vec2 u_MousePos;
uniform vec2 u_MouseVelocity;
uniform float u_Time;

void main() {
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
        gl_FragColor = vec4(vec3(1.0) * pulse, 0.7);
    } else {
        gl_FragColor = vec4(0.25, 0.0, 0.65, 1.0);
    }
}
