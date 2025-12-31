import { css, html } from "lit";
import { WebComponent } from "./component";
import linkIconUrl from "./assets/link_ico.svg"
import * as Three from "three"
import { type OffscreenShaderRenderPass, OffscreenShaderRenderer } from "./webgl/renderer_util.ts"

export class ScanLineHeading extends WebComponent("scan-line-heading")
{
	static styles = [
		super.styles,
		css`

		  :host {
				display: block;
			}

			.wrapper {
				position: relative;
			}

			.heading {
			  position: relative;
				image-rendering: pixelated;
				text-align: center;
				z-index: 1;
				background: linear-gradient(to bottom, #ff00ff, #00ffff);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				font-size: 5rem;
			}

			.background {
				position: absolute;
				display: block;
				transform: translate(-100px, -50px);
			}
		`
	]

	shader = new Three.ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Three.Vector2() },
    u_time: { value: 0 }
  },
  vertexShader: `
    varying vec2 v_uv;
    void main() {
      v_uv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;

    // Retro purple/violet color palette
    vec3 deepPurple = vec3(0.15, 0.05, 0.25);
    vec3 brightPurple = vec3(0.6, 0.2, 0.8);
    vec3 mutedPurple = vec3(0.45, 0.25, 0.55);

    float getGrid(vec2 gridUv, float perspective) {
      float gridSize = 12.0;
      float lineWidth = 0.04;

      // Horizontal lines
      float horizLine = fract(gridUv.y * gridSize);
      horizLine = smoothstep(lineWidth, lineWidth * 0.5, horizLine) +
                  smoothstep(1.0 - lineWidth, 1.0 - lineWidth * 0.5, horizLine);

      // Vertical lines with perspective adjustment
      float vertSpacing = gridSize * perspective;
      float vertLine = fract((gridUv.x - 0.5) * vertSpacing + 0.5);
      vertLine = smoothstep(lineWidth * 1.5, lineWidth * 0.75, vertLine) +
                 smoothstep(1.0 - lineWidth * 1.5, 1.0 - lineWidth * 0.75, vertLine);

      return max(horizLine, vertLine * 0.6);
    }

    void main() {
      vec2 uv = v_uv;

      // Chromatic aberration offset from center
      vec2 offset = (uv - 0.5) * 2.0;
      float distFromCenter = length(offset);
      float aberrationStrength = distFromCenter * 0.008;

      // Create perspective grid effect with chromatic aberration
      float perspective = 1.0 - uv.y * 0.7;

      // Sample grid with RGB offset
      vec2 rOffset = vec2(aberrationStrength, 0.0);
      vec2 gOffset = vec2(0.0, 0.0);
      vec2 bOffset = vec2(-aberrationStrength, 0.0);

      vec2 gridUvR = vec2(uv.x + rOffset.x, (uv.y + rOffset.y) / perspective);
      vec2 gridUvG = vec2(uv.x + gOffset.x, (uv.y + gOffset.y) / perspective);
      vec2 gridUvB = vec2(uv.x + bOffset.x, (uv.y + bOffset.y) / perspective);

      // Animate grid movement
      gridUvR.y += u_time * 0.15;
      gridUvG.y += u_time * 0.15;
      gridUvB.y += u_time * 0.15;

      float perspectiveR = 1.0 - (uv.y + rOffset.y) * 0.7;
      float perspectiveG = 1.0 - (uv.y + gOffset.y) * 0.7;
      float perspectiveB = 1.0 - (uv.y + bOffset.y) * 0.7;

      float gridR = getGrid(gridUvR, perspectiveR);
      float gridG = getGrid(gridUvG, perspectiveG);
      float gridB = getGrid(gridUvB, perspectiveB);

      // Non-uniform edge fade to black
      float fadeTop = smoothstep(1.0, 0.5, uv.y);
      float fadeBottom = smoothstep(0.0, 0.3, uv.y);

      // Asymmetric horizontal fades
      float fadeLeft = smoothstep(0.0, 0.25, uv.x);
      float fadeRight = smoothstep(1.0, 0.7, uv.x);

      // Non-uniform corner fading
      float topLeftCorner = smoothstep(0.0, 0.4, length(vec2(uv.x, 1.0 - uv.y)));
      float topRightCorner = smoothstep(0.0, 0.35, length(vec2(1.0 - uv.x, 1.0 - uv.y)));
      float bottomLeftCorner = smoothstep(0.0, 0.5, length(vec2(uv.x, uv.y)));
      float bottomRightCorner = smoothstep(0.0, 0.45, length(vec2(1.0 - uv.x, uv.y)));

      float cornerMask = topLeftCorner * topRightCorner * bottomLeftCorner * bottomRightCorner;

      // Combine all fades
      float edgeMask = fadeTop * fadeBottom * fadeLeft * fadeRight * cornerMask;

      // Distance-based glow
      float distGlow = pow(1.0 - uv.y, 2.0) * 0.4;

      // Build color channels separately with chromatic aberration
      vec3 gridColorR = mix(mutedPurple, brightPurple, gridR * perspectiveR);
      vec3 gridColorG = mix(mutedPurple, brightPurple, gridG * perspectiveG);
      vec3 gridColorB = mix(mutedPurple, brightPurple, gridB * perspectiveB);

      vec3 finalColor;
      finalColor.r = (gridColorR.r * gridR + distGlow * deepPurple.r) * edgeMask;
      finalColor.g = (gridColorG.g * gridG + distGlow * deepPurple.g) * edgeMask;
      finalColor.b = (gridColorB.b * gridB + distGlow * deepPurple.b) * edgeMask;

      // Subtle scanline effect
      float scanline = sin(uv.y * 300.0 + u_time * 2.0) * 0.02 + 1.0;
      finalColor *= scanline;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
})

	pass?: OffscreenShaderRenderPass;

	onMounted() {
	  this.pass = {
			output: this.shadowRoot.querySelector("canvas"),
			shader: this.shader,
		}
		this.renderCanvas()
	}

	renderCanvas = () => {
	  requestAnimationFrame(this.renderCanvas)
	  const canvas = this.pass.output
		const bounds = this.getBoundingClientRect()
		canvas.width = (bounds.width + 200) * 2
		canvas.height = (bounds.height + 100) * 2
		canvas.style.width = canvas.width/2 + "px"
		canvas.style.height = canvas.height/2 + "px"
		this.shader.uniforms.u_resolution.value.set(canvas.width, canvas.height)
		this.shader.uniforms.u_time.value = performance.now() / 1000
		OffscreenShaderRenderer.render(this.pass)
	}

	render = () => html`
    <div class="wrapper font-pixel">
    <canvas class="background"></canvas>
    <h1 class="heading"><slot></slot></h1>
    </div>
	`
}
ScanLineHeading.define()

export class WorkCompilation extends WebComponent("work-compilation")
{
	static styles = [super.styles, css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 769px;
		}

		figure {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}

		.img1, .img2, .img3 {
			position: relative;
			box-shadow: 0 8px 12px rgba(0, 0, 0, 0.7);
			width: 200px;
	  }

		.img1 {
			transform: rotate(-4deg) translateX(20px)
		}

		.img2 {
			transform: translateY(-20px)
		}

		.img3 {
			transform: rotate(3deg) translateX(-15px)
		}
	`]

	render = () => html`
		<scan-line-heading class="font-pixel">Work Compilation</scan-line-heading>
		<!--<figure>
			<img class="img1" src="https://picsum.photos/200/301.jpg">
			<img class="img2" src="https://picsum.photos/200/302.jpg">
			<img class="img3" src="https://picsum.photos/200/303.jpg">
		</figure>-->
	`
}
WorkCompilation.define()

export class ProjectSummary extends WebComponent("project-summary")
{
	static get properties()
	{
		return {
			header: { type: String }
		}
	}

	static styles = [super.styles, css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 524px;
		}

		h3 {
			font-size: 2.25rem;
			font-weight: 400;
			margin-bottom: 0.5rem;
			font-family: 'Pixel Font', sans-serif;
			text-align: center;
		}

		p {
			font-size: .9rem;
			opacity: .75;
			margin-bottom: 3rem;
		}
	`]

	declare header: string;

	onMounted() {

	}

	render = () => html`
		<h3 class="font-pixel">${this.header}</h3>
		<p><slot></slot></p>
	`
}
ProjectSummary.define()

export class ImageGrid extends WebComponent("image-grid")
{
	static styles = css`
		:host {
			max-width: 1200px;
			margin: auto;
			display: grid;
			grid-template-columns: repeat(var(--columns, 6), 1fr);
			gap: 1.5rem;
		}
	`

	render = () => html`
		<slot></slot>
	`
}
ImageGrid.define()

export class GridImage extends WebComponent("grid-image")
{
	static get properties()
	{
		return {
			src: { type: String },
			alt: { type: String },
			href: { type: String },
			span: { type: Number, reflect: true, default: 1 },
		}
	}

	static styles = [super.styles, css`
	  :host {
	    position: relative;
			height: 400px;
	  }

		img {
		  position: relative;
			width: 100%;
			height: 400px;
			object-fit: cover;
			z-index: 1;
			margin: auto;
		}

		.background {
		  position: absolute;
			top: -2px;
			left: -2px;
			right: -2px;
			bottom: -2px;
			background: violet;
		}

		.outlink {
		  position: absolute;
			top: 1rem;
			right: 1rem;
			z-index: 10;
			background: violet;
			width: 32px;
			height: 32px;
			opacity: .5;
		}

		.outlink:hover {
			opacity: 1;
		}

		.glow {
		  position: absolute;
	    top: 25px;
	    left: 25px;
	    right: 25px;
	    bottom: 25px;
	    background: violet;
			filter: blur(30px);
		  z-index: 0;
		}

		.link-icon {
			width: 32px;
			height: 32px;
		}
	`]

	declare src: string;
	declare span: number;
	declare href: string;
	declare alt: string;

	onMount(): void {
		this.style.gridColumn = `span ${this.span}`;
	}

	render = () => html`
		<img class="border-pixels-8" src="${this.src}" alt="${this.alt}">
		<a class="outlink border-pixels-4" href="${this.href}" target="_blank"><img class="link-icon" src="${linkIconUrl}"></a>
		<div class="background border-pixels-8"></div>
		<div class="glow"></div>
	`
}
GridImage.define()
