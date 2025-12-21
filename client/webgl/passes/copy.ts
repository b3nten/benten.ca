import {Pass} from "three/examples/jsm/postprocessing/Pass.js";
import * as Three from "three";
import {type WebGLRenderer, type WebGLRenderTarget} from "three";
import {ScreenRenderer} from "../renderer_util";

export class CopyPass extends Pass {
    needsSwap: boolean = true;

    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget | null, readBuffer: WebGLRenderTarget) {
        this.copyShader.uniforms["tDiffuse"].value = readBuffer.texture;
        renderer.setRenderTarget(writeBuffer);
        ScreenRenderer.render(renderer, this.copyShader);
    }

    copyShader = new Three.ShaderMaterial({
        uniforms: {
            tDiffuse: {value: null},
        },
        vertexShader: `
            varying vec2 v_Uv;
            void main() {
                v_Uv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            varying vec2 v_Uv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, v_Uv);
            }
        `,
    })
}