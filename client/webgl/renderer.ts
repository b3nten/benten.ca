import { assert, type IRenderPipeline, type Viewport } from "elysiatech";
import * as Three from "three"
import * as Postprocessing from "postprocessing"
// @ts-expect-error missing types
import { N8AOPostPass } from "n8ao";

export class HidefRenderPipeline implements IRenderPipeline
{
	composer?: Postprocessing.EffectComposer

	configure(renderer: Three.WebGLRenderer): void
	{
		console.log("configure")
		renderer.info.autoReset = false;
		renderer.toneMapping = Three.NoToneMapping;

		this.composer = new Postprocessing.EffectComposer(renderer, {
			frameBufferType: Three.HalfFloatType,
			alpha: true,
		});

		this.composer.addPass(new Postprocessing.RenderPass());

		{
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

			this.composer.addPass(n8aopass);
		}

		this.composer.addPass(
      new Postprocessing.EffectPass(
        undefined,
        new Postprocessing.ToneMappingEffect({
          mode: Postprocessing.ToneMappingMode.ACES_FILMIC,
        }),
      ),
    );

    this.composer.addPass(
      new Postprocessing.EffectPass(
        undefined,
        new Postprocessing.BrightnessContrastEffect({
          brightness: 0.05,
          contrast: 0.15,
        }),
      ),
    );

    this.composer.addPass(
      new Postprocessing.EffectPass(
        undefined,
        new Postprocessing.SMAAEffect({
          preset: Postprocessing.SMAAPreset.MEDIUM,
        }),
      ),
    );
	}

	render(delta: number, scene: Three.Scene, camera: Three.Camera, renderer: Three.WebGLRenderer, viewport: Viewport): void
	{
		assert(this.composer, "Composer doesn't exist??")
		this.composer.setSize(viewport.width, viewport.height);
    this.composer.setMainCamera(camera);
    this.composer.setMainScene(scene);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.composer.render(delta);
	}

	constructor()
	{
		this.configure = this.configure.bind(this);
		this.render = this.render.bind(this);
	}
}
