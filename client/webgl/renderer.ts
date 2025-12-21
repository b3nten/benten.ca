import {Input, type IRenderPipeline, remapRange, type Viewport, World} from "elysiatech";
import * as Three from "three"
import {PixelPass} from "./shaders/pixelation";
import {SSAOPass} from "three/examples/jsm/postprocessing/SSAOPass.js";
import {Pass} from "three/examples/jsm/postprocessing/Pass.js";
import {assert} from "elysiatech/lib";
import {Vector2, type WebGLRenderer, type WebGLRenderTarget} from "three";
import {ScreenRenderer} from "./renderer_util";
import {UberShaderPass} from "./shaders/color";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BloomPass} from "three/examples/jsm/postprocessing/BloomPass.js";
import {BackgroundPass} from "./shaders/bg";
import {TransparentBloom} from "./shaders/bloom";

export class CustomRenderPipeline implements IRenderPipeline {
    world?: World;

    swapChain = new SwapChain();

    prepassPass = new PrepassClass;

    saoPass: SSAOPass;

    pixelPass = new PixelPass();

    uberPass = new UberShaderPass()

    bloom = new TransparentBloom(
        new Three.Vector2(512, 512),
        1.5,
        0.4,
        .9,
    )

    // bloom = new BloomPass(1.5, 32)

    backgroundPass = new BackgroundPass;

    copyPass = new CopyPass();

    createRenderer(canvas: HTMLCanvasElement): Three.WebGLRenderer {
        return new Three.WebGLRenderer({
            canvas,
            antialias: false,
            powerPreference: "high-performance",
            precision: "highp",
            alpha: true,
            depth: false,
            stencil: false,
        })
    }

    configure = (renderer: Three.WebGLRenderer): void => {
        window.addEventListener("scroll", this._onScroll.bind(this))

        renderer.setPixelRatio(1)
        renderer.info.autoReset = false;
        renderer.toneMapping = Three.NoToneMapping;
        // renderer.autoClear = false;
        // renderer.autoClearDepth = false;
    }

    render = (delta: number, scene: Three.Scene, camera: Three.Camera, renderer: Three.WebGLRenderer, viewport: Viewport): void => {
        if(!this.saoPass) {
            this.saoPass = new SSAOPass(scene, camera as Three.PerspectiveCamera, viewport.width, viewport.height);
        }
        this._preparePasses(scene, camera, viewport);

        this.prepassPass.render(renderer)

        // foreground elements
        renderer.setRenderTarget(this.swapChain.writable);
        renderer.render(scene, camera)
        this.swapChain.swap();

        // this.saoPass.output = SSAOPass.OUTPUT.Blur
        this.saoPass.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);

        // bloom
        this.bloom.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);

        // pixel effect
        this.pixelPass.prerender(renderer, this.swapChain.readable.texture, this.prepassPass.depthTexture, this.prepassPass.normalTexture);
        this.pixelPass.render(renderer, this.swapChain.writable);
        this.swapChain.swap();

        this.backgroundPass.shader.uniforms["u_MousePos"].value = new Vector2(Input.mouseX, Input.mouseY);
        this.backgroundPass.shader.uniforms["u_Time"].value += delta;
        this.backgroundPass.shader.uniforms["u_MouseVelocity"].value = new Vector2(Input.mouseDeltaX, Input.mouseDeltaY);
        this.backgroundPass.depthTexture = this.prepassPass.depthTexture;
        this.backgroundPass.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);
        this.swapChain.swap();

        // uberpass
        this.uberPass.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);
        this.swapChain.swap();

        // final copy to screen
        this.copyPass.render(renderer, null, this.swapChain.readable, delta, false);
    }

    _preparePasses(scene: Three.Scene, camera: Three.Camera, viewport: Viewport)
    {
        this.swapChain.setSize(viewport.width, viewport.height);
        this.prepassPass.update(scene, camera);
        this.prepassPass.setSize(viewport.width, viewport.height);
        this.pixelPass.setSize(viewport.width, viewport.height);
        this.uberPass.setSize(viewport.width, viewport.height);
        this.saoPass.camera = camera as Three.PerspectiveCamera;
        this.saoPass.scene = scene;
        this.saoPass.setSize(viewport.width, viewport.height);
        this.bloom.setSize(viewport.width, viewport.height);
        this.backgroundPass.setSize(viewport.width, viewport.height);
    }

    _onScroll() {
        const scrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 2, 0, 1);
        this.pixelPass.pixelSize = remapRange(scrollAmount, 0, 1, 1, 30)
        const doubledScrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 4, 0, 1);
        this.uberPass.shader.uniforms["u_Brightness"].value = remapRange(doubledScrollAmount, 1, 0, -2, .065)
    }
}

class PrepassClass extends Pass
{
    depthTarget = new Three.WebGLRenderTarget(1,1, {
        depthBuffer: true,
        stencilBuffer: false,
        format: Three.RGBAFormat,
        type: Three.UnsignedByteType,
        depthTexture: new Three.DepthTexture(1,1, Three.UnsignedShortType),
        resolveDepthBuffer: true,
    });

    get depthTexture() { return this.depthTarget.depthTexture! }

    get normalTexture() { return this.depthTarget.texture }

    scene?: Three.Scene;
    camera?: Three.Camera
    material = new Three.MeshNormalMaterial();

    update(scene: Three.Scene, camera: Three.Camera)
    {
        this.scene = scene;
        this.camera = camera;
    }

    render(renderer: Three.WebGLRenderer)
    {
        assert(this.scene, "PrepassClass: No scene set for prepass");
        assert(this.camera, "PrepassClass: No camera set for prepass");

        renderer.setRenderTarget(this.depthTarget);
        renderer.clear();

        const previousOverrideMaterial = this.scene.overrideMaterial;
        this.scene.overrideMaterial = this.material;

        renderer.render(this.scene, this.camera);

        this.scene.overrideMaterial = previousOverrideMaterial;
    }

    setSize(width: number, height: number)
    {
        this.depthTarget.setSize(width, height);
    }

    #depthBuffer: WebGLRenderbuffer | null = null;
}

class SwapChain
{

    get readable() { return this._target0; }
    get writable() { return this._target1; }

    constructor()
    {
        this._target0 = new Three.WebGLRenderTarget(1, 1, {
            depthBuffer: true,
            stencilBuffer: false,
            format: Three.RGBAFormat,
            type: Three.UnsignedByteType,
        });
        this._target1 = this._target0.clone();
    }

    setSize(width: number, height: number)
    {
        this._target0.setSize(width, height);
        this._target1.setSize(width, height);
    }

    swap()
    {
        const temp = this._target0;
        this._target0 = this._target1;
        this._target1 = temp;
    }

    _target0: Three.WebGLRenderTarget;
    _target1: Three.WebGLRenderTarget
}

class CopyPass extends Pass
{
    needsSwap: boolean = true;

    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean)
    {
        this.copyShader.uniforms["tDiffuse"].value = readBuffer.texture;
        renderer.setRenderTarget(writeBuffer);
        ScreenRenderer.render(renderer, this.copyShader);
    }

    copyShader = new Three.ShaderMaterial({
        uniforms: {
            tDiffuse: { value: null },
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