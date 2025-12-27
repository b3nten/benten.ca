import {Input, type IRenderPipeline, remapRange, type Viewport} from "elysiatech";
import * as Three from "three"
import {Vector2} from "three"
import {PixelPass} from "./passes/pixelation";
import {SSAOPass} from "three/examples/jsm/postprocessing/SSAOPass.js";
import {UberShaderPass} from "./passes/uber";
import {BackgroundPass} from "./passes/background";
import {TransparentBloom} from "./passes/bloom";
import {CopyPass} from "./passes/copy";
import {SwapChain} from "./renderer_util";
import {Prepass} from "./passes/pre";

export class CustomRenderPipeline implements IRenderPipeline
{
    swapChain = new SwapChain();

    prepass = new Prepass;

    saoPass?: SSAOPass;

    pixelPass = new PixelPass();

    uberPass = new UberShaderPass()

    bloom = new TransparentBloom(new Three.Vector2(512, 512), 1.5, 0.4, .9)

    backgroundPass = new BackgroundPass;

    copyPass = new CopyPass();

    createRenderer(canvas: HTMLCanvasElement): Three.WebGLRenderer
    {
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

    configure = (renderer: Three.WebGLRenderer): void =>
    {
        window.addEventListener("scroll", this.onScroll.bind(this))

        renderer.setPixelRatio(1)
        renderer.info.autoReset = false;
        renderer.toneMapping = Three.NoToneMapping;
    }

    render = (delta: number, scene: Three.Scene, camera: Three.Camera, renderer: Three.WebGLRenderer, viewport: Viewport): void =>
    {
        this.preparePasses(scene, camera, viewport);

        // prepass (depth + normals)
        this.prepass.render(renderer)

        // foreground elements
        renderer.setRenderTarget(this.swapChain.writable);
        renderer.render(scene, camera)
        this.swapChain.swap();

        // ssao
        this.saoPass?.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);

        // bloom
        this.bloom.render(renderer, this.swapChain.writable, this.swapChain.readable, delta, false);

        // pixel effect
        this.pixelPass.prerender(renderer, this.swapChain.readable.texture, this.prepass.depthTexture, this.prepass.normalTexture);
        this.pixelPass.render(renderer, this.swapChain.writable);
        this.swapChain.swap();

        // background pass
        this.backgroundPass.shader.uniforms["u_Time"].value += delta;
        this.backgroundPass.depthTexture = this.prepass.depthTexture;
        this.backgroundPass.render(renderer, this.swapChain.writable, this.swapChain.readable);
        this.swapChain.swap();

        // uberpass (color grading + final effects)
        this.uberPass.render(renderer, this.swapChain.writable, this.swapChain.readable);
        this.swapChain.swap();

        // final copy to screen
        this.copyPass.render(renderer, null, this.swapChain.readable);
    }

    preparePasses(scene: Three.Scene, camera: Three.Camera, viewport: Viewport)
    {
        if(!this.saoPass) {
            this.saoPass = new SSAOPass(scene, camera as Three.PerspectiveCamera, viewport.width, viewport.height);
        }
        this.swapChain.setSize(viewport.width, viewport.height);
        this.prepass.update(scene, camera);
        this.prepass.setSize(viewport.width, viewport.height);
        this.pixelPass.setSize(viewport.width, viewport.height);
        this.uberPass.setSize(viewport.width, viewport.height);
        this.saoPass.camera = camera as Three.PerspectiveCamera;
        this.saoPass.scene = scene;
        this.saoPass.setSize(viewport.width, viewport.height);
        this.bloom.setSize(viewport.width, viewport.height);
        this.backgroundPass.setSize(viewport.width, viewport.height);
        this.backgroundPass.shader.uniforms["u_MousePos"].value.set(Input.mouseX, Input.mouseY);
        this.backgroundPass.shader.uniforms["u_MouseVelocity"].value.set(Input.mouseDeltaX, Input.mouseDeltaY);
    }

    onScroll()
    {
        const scrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 2, 0, 1);
        this.pixelPass.pixelSize = remapRange(scrollAmount, 0, 1, 1, 30)
        const doubledScrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 4, 0, 1);
        this.uberPass.shader.uniforms["u_Brightness"].value = remapRange(doubledScrollAmount, 1, 0, -2, .065)
    }
}
