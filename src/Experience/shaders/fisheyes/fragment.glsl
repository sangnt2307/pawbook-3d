uniform sampler2D tDiffuse;    // sampler of rendered scene?s render target
varying vec3 vUV;                // interpolated vertex output data
varying vec2 vUVDot;           // interpolated vertex output data

void main() {
    vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;
    gl_FragColor = texture2DProj(tDiffuse, uv);
}