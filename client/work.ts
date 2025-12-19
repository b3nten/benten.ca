import { css, html } from "lit";
import { WebComponent } from "./component";

export class ScanLineHeading extends WebComponent("scan-line-heading")
{
	static styles = [
		super.styles,
		css`
			.wrapper {
				position: relative;
			}

			.heading {
				image-rendering: pixelated;
				text-shadow:
					0 0 10px #ff00ff,
					0 0 20px #ff00ff,
					0 0 30px #ff00ff,
					0 0 40px #00ffff,
					2px 2px 0px #ff0080,
					4px 4px 0px #00ffff,
					6px 6px 0px #ff00ff;
					z-index: 1;
					background: linear-gradient(to bottom, #ff00ff, #00ffff);
					/*-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;*/
					font-size: 5rem;
					position: relative;
			}
/*
			.background {
				pointer-events: none;
				position: absolute;
				inset: 0;
				background-image: repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.1) 0px, transparent 2px, transparent 4px);
				animation: scanline 8s linear infinite;
				pointer-events: none;
			}*/

			@keyframes scanline {
				0% {
					background-position: 0 -100%;
				}
				100% {
					background-position: 0 100%;
				}
			}
		`
	]
	render = () => html`
    <div class="wrapper font-pixel">
      <h1 class="heading"><slot></slot></h1>
      <div class="background"></div>
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
		<figure>
			<img class="img1" src="https://picsum.photos/200/301.jpg">
			<img class="img2" src="https://picsum.photos/200/302.jpg">
			<img class="img3" src="https://picsum.photos/200/303.jpg">
		</figure>
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

	static styles = css`
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
			text-align: center;
		}

		p {
			font-size: 1.25rem;
			opacity: .75;
			margin-bottom: 3rem;
		}
	`

	declare header: string;

	render = () => html`
		<h3>${this.header}</h3>
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
			gap: 1rem;
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
			span: { type: Number, reflect: true, default: 1 },
		}
	}
	static styles = css`
		img {
			border: 1px solid oklch(0.2484 0.018 262.040009);
			width: 100%;
			height: 500px;
			object-fit: cover;
		}
	`

	declare src: string;
	declare span: number;

	onMount(): void {
		this.style.gridColumn = `span ${this.span}`;
	}

	render = () => html`
		<img
			class="img1"
			src="${this.src}"
		>
	`
}
GridImage.define()
