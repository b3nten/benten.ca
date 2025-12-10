import { clamp, remapRange, World, type IRenderPipeline, type Viewport } from "elysiatech";
import * as Three from "three"
import * as Postprocessing from "postprocessing"
// @ts-expect-error missing types
import { N8AOPostPass } from "n8ao";
import { ColliderComponent } from "./physics";

export class HidefRenderPipeline implements IRenderPipeline
{
	world?: World;
	composer?: Postprocessing.EffectComposer

	vignetteEffect = new Postprocessing.VignetteEffect({
		darkness: .7,
		offset: .2,
	});

	brightnessContrast = new Postprocessing.BrightnessContrastEffect({
    brightness: 0.05,
    contrast: 0.15,
  })

	pixelEffect = new Postprocessing.PixelationEffect(1)

	configure(renderer: Three.WebGLRenderer, world: World): void
	{
		this.world = world;
		renderer.setPixelRatio(1)
		renderer.info.autoReset = false;
		renderer.toneMapping = Three.NoToneMapping;

		this.composer = new Postprocessing.EffectComposer(renderer, {
			frameBufferType: Three.HalfFloatType,
			alpha: true,
		});

		const n8aopass = new N8AOPostPass(
			new Three.Scene(),
			new Three.PerspectiveCamera(),
			window.innerWidth,
			window.innerHeight,
		);
		n8aopass.configuration.aoRadius = 3.0;
		n8aopass.configuration.distanceFalloff = 1.0;
		n8aopass.configuration.intensity = 2.0;
		n8aopass.configuration.color = new Three.Color(0, 0, 0);

		const bloomEffect = new Postprocessing.BloomEffect({
			intensity: 1.0,
			luminanceThreshold: 0.3,
			luminanceSmoothing: 0.075,
		});

		// Passes

		this.composer.addPass(new Postprocessing.RenderPass());

		this.composer.addPass(n8aopass);

		this.composer.addPass(
			new Postprocessing.EffectPass(
				undefined,
				new Postprocessing.ChromaticAberrationEffect(),
			)
		)

		this.composer.addPass(
			new Postprocessing.EffectPass(
				undefined,
				this.pixelEffect,
			)
		)

		this.composer.addPass(
      new Postprocessing.EffectPass(
        undefined,
        bloomEffect,
        this.vignetteEffect,
        new Postprocessing.ToneMappingEffect({
          mode: Postprocessing.ToneMappingMode.ACES_FILMIC,
        }),
        this.brightnessContrast,
        new Postprocessing.SMAAEffect({
          preset: Postprocessing.SMAAPreset.MEDIUM,
        }),
      ),
    );

		window.addEventListener("scroll", this.onScroll)
	}

	render(delta: number, scene: Three.Scene, camera: Three.Camera, _: Three.WebGLRenderer, viewport: Viewport): void
	{
		this.composer!.setSize(viewport.width, viewport.height);
    this.composer!.setMainCamera(camera);
    this.composer!.setMainScene(scene);
    this.composer!.render(delta);
	}

	constructor()
	{
		this.configure = this.configure.bind(this);
		this.render = this.render.bind(this);
	}

	onScroll = () => {
		const scrollAmount = remapRange(window.scrollY, 0, window.innerHeight, 0, 1);
		const doubledScrollAmount = remapRange(window.scrollY, 0, window.innerHeight * 4, 0, 1);

		this.pixelEffect.granularity = remapRange(scrollAmount, 0, 1, 1, 20)
		this.brightnessContrast.brightness = remapRange(doubledScrollAmount, 1, 0, -2, .065)

		const ballCollider = this.world!.getComponent(globalThis.RESIZE_BALL_ENTITY, ColliderComponent)?.impl?.setRadius(
			remapRange(doubledScrollAmount, 0, 1, 0.1, 20)
		)
	}
}
