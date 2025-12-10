import { css, html } from "lit";
import { WebComponent } from "./component";

export class Page extends WebComponent("page-outlet")
{
	static styles = css`
		:host {
			position: relative;
			display: block;
		}
		main {

		}
		footer-window {
			display: block;
			height: 600px;
		}
	`

	render = () => html`
		<hero-block></hero-block>
		<main>
			<about-me></about-me>
			<work-compilation></work-compilation>
			<project-summary header="Shader light effects">
				Ever since I started working with WebGL and shaders, I was fascinated by the idea of reproducing beautiful light effects such as refraction, dispersion, and caustics. Balancing the physical aspect of these effects and aesthetics for a pleasing output was the most challenging part of this exploratory work.
			</project-summary>
			<image-grid style="--columns: 8">
				<grid-image span=3 src="https://picsum.photos/1200/800.jpg"></grid-image>
				<grid-image span="5" src="https://picsum.photos/1200/801.jpg"></grid-image>
				<grid-image span="5" src="https://picsum.photos/1200/900.jpg"></grid-image>
			</image-grid>
			<!-- <inspiration-block></inspiration-block> -->
			<contact-section></contact-section>
		</main>
		<footer-window></footer-window>
	`
}

export class Hero extends WebComponent("hero-block")
{
	static styles = css`
		:host {
			display: block;
			position: relative;
			height: 200vh;
			width: 100vw;
		}
	`
}
Hero.define()

export class AboutMe extends WebComponent("about-me")
{
	static styles = css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 769px;
			height: 200vh;
		}

		.sticky {
			position: sticky;
			top: 10rem;
			padding-bottom: 4rem;
		}

		img {
			max-width: 200px;
			filter: grayscale(1) invert(1) brightness(1.2);
			margin-block: 1.75rem;
		}

		p {
			font-size: 1.25rem;
			opacity: .75;

			&.bold {
				opacity: 9;
				font-weight: 600;
			}

			&.footer {
				font-size: .9rem;
			}
		}
	`
	render = () => html`
		<div class="sticky">
		<p class="bold">
			Hi! I'm Benton, a fullstack engineer based in Canada. Welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.
		</p>
		<p>
			Throughout the past decade, I have worked with many startups building well designed, fast, and delightful user experiences. During this time, I continuously refined my craft by sharpening my eye through the inspiring work of many other creative developers, designers, and 3D artists and working hard on my engineering skills to meet my ever-evolving taste in visual design.
		</p>
		<p>
			My appetite for learning recently lead me to focus on what I believe is the future of the web: 3D, WebGL, and shaders.
		</p>
		<p>
			When not building, I like sharing what I learned on my blog, through interactive experiences and playgrounds. You can also find me running in the streets of NYC or just walking around enjoying a nice cup of coffee.
		</p>
		<img src="/sig.png">
		<p class="footer">
			<span>Victoria, CA</span> <br>
			<span>Oct 2025</span>
		</p>
		</div>
	`
}
AboutMe.define()

export class WorkCompilation extends WebComponent("work-compilation")
{
	static styles = css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 769px;
		}

		h2 {
			font-size: 3.5rem;
			margin-bottom: -1.5rem;
			text-align: center;
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
	`

	render = () => html`
		<h2>Work Compilation</h2>
		<figure>
			<img class="img1" src="https://picsum.photos/200/301.jpg">
			<img class="img2" src="https://picsum.photos/200/302.jpg">
			<img class="img3" src="https://picsum.photos/200/303.jpg">
		</figure>
	`
}
WorkCompilation.define()

export class Inspiration extends WebComponent("inspiration-block")
{
	static styles = css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 769px;
		}
	`

	render = () => html`
		<h2>Inspiration</h2>
		<p>
			My work doesn't happen in a vacuum. It is the result of being continuously exposed to the work and art of thousands of artists, designers, and creators. They influence my work a contribute to cultivating my own style, taste, and how I approach and solve problems.
		</p>
		<p>
			Below is a non-exhaustive curated snapshot of some of my favorite sources of inspiration that I've collected over the years.
		</p>
	`
}
Inspiration.define()

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

export class Contact extends WebComponent("contact-section")
{
	static styles = css`
		:host {
			display: block;
			position: relative;
			margin: auto;
			max-width: 1200px;
		}
		h2 {
			opacity: .9;
			font-size: 2.5rem;
			margin-bottom: 1rem;
		}
		p {
			font-size: 1.35rem;
			opacity: .75;
		}
	`
	render = () => html`
		<h2>Want to get in touch? Or just say Hi?</h2>
		<p>
			Drop me a line at  ben@benten.ca. <br>
			Say the magic word so I know you're not a bot: BENTONCODES2025 <br>
			If you ever come to Victoria, let's meet up for coffee. <br>
		</p>
	`
}
Contact.define()

export class Footer extends WebComponent("footer-section")
{
	static styles = css`
		:host {
			position: fixed;
			display: block;
			bottom: 0;
			left: 0;
			right: 0;
			background: linear-gradient(180deg, #000 0%, #1a1a1a 100%);
			color: #fff;
			font-family: 'Courier New', monospace;
			overflow: hidden;
			opacity: 0;
			pointer-events: none;
		}

		.scanlines {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: repeating-linear-gradient(
				0deg,
				rgba(255, 255, 255, 0.03) 0px,
				rgba(255, 255, 255, 0.03) 1px,
				transparent 1px,
				transparent 2px
			);
			pointer-events: none;
			z-index: 1;
		}

		.container {
			position: relative;
			z-index: 2;
			max-width: 1200px;
			margin: 0 auto;
			padding: 40px 20px;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 40px;
			margin-bottom: 40px;
		}

		.section {
			border: 1px solid #fff;
			padding: 20px;
			background: rgba(0, 0, 0, 0.5);
			box-shadow: 3px 3px 0 rgba(255, 255, 255, 0.3);
		}

		.section h3 {
			margin: 0 0 15px 0;
			font-size: 14px;
			letter-spacing: 2px;
			text-transform: uppercase;
			border-bottom: 1px solid #fff;
			padding-bottom: 10px;
		}

		.logo-section {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.logo {
			width: 80px;
			height: 80px;
			margin-bottom: 15px;
			filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
		}

		.name {
			font-size: 16px;
			font-weight: bold;
			letter-spacing: 1px;
			margin-bottom: 5px;
		}

		.tagline {
			font-size: 11px;
			opacity: 0.7;
			font-style: italic;
		}

		.links {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		.links li {
			margin-bottom: 12px;
		}

		.links a {
			color: #fff;
			text-decoration: none;
			font-size: 13px;
			display: flex;
			align-items: center;
			transition: all 0.2s;
			letter-spacing: 1px;
		}

		.links a:before {
			content: '>';
			margin-right: 8px;
			transition: margin-right 0.2s;
		}

		.links a:hover {
			text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
		}

		.links a:hover:before {
			margin-right: 12px;
		}

		.terminal {
			font-size: 11px;
			line-height: 1.6;
			opacity: 0.8;
		}

		.terminal-line {
			margin-bottom: 5px;
		}

		.blink {
			animation: blink 1s infinite;
		}

		@keyframes blink {
			0%, 49% { opacity: 1; }
			50%, 100% { opacity: 0; }
		}

		.bottom-bar {
			border-top: 1px solid #fff;
			padding-top: 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			gap: 15px;
			font-size: 11px;
		}

		.copyright {
			letter-spacing: 1px;
		}

		.status {
			display: flex;
			gap: 15px;
			align-items: center;
		}

		.status-item {
			display: flex;
			align-items: center;
			gap: 5px;
		}

		.status-dot {
			width: 8px;
			height: 8px;
			background: #fff;
			border-radius: 50%;
			animation: pulse 2s infinite;
		}

		@keyframes pulse {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.3; }
		}

		@media (max-width: 768px) {
			.grid {
				grid-template-columns: 1fr;
			}

			.bottom-bar {
				flex-direction: column;
				text-align: center;
			}
		}
	`

	render = () => html`
		<div class="scanlines"></div>
		<div class="container">
			<div class="grid">
				<div class="section logo-section">
					<svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="2"/>
						<polygon points="50,30 70,50 50,70 30,50" fill="white"/>
						<circle cx="50" cy="50" r="8" fill="black"/>
					</svg>
					<div class="name">BENTON BOYCHUK-CHORNEY</div>
					<div class="tagline">// DIGITAL ARCHITECT //</div>
				</div>

				<div class="section">
					<h3>[ LINKS ]</h3>
					<ul class="links">
						<li><a href="/resume">Resume</a></li>
						<li><a href="https://github.com/bentonboychuk" target="_blank">Github</a></li>
						<li><a href="https://artstation.com/bentonboychuk" target="_blank">Artstation</a></li>
						<li><a href="mailto:contact@benton.dev">Email</a></li>
					</ul>
				</div>

				<div class="section">
					<h3>[ SYSTEM STATUS ]</h3>
					<div class="terminal">
						<div class="terminal-line">> Initializing connection...</div>
						<div class="terminal-line">> Portfolio loaded: OK</div>
						<div class="terminal-line">> Memory available: 640K</div>
						<div class="terminal-line">> Graphics mode: VGA</div>
						<div class="terminal-line">> Status: ONLINE<span class="blink">_</span></div>
					</div>
				</div>
			</div>

			<div class="bottom-bar">
				<div class="copyright">
					© ${new Date().getFullYear()} BENTON BOYCHUK-CHORNEY // ALL RIGHTS RESERVED
				</div>
				<div class="status">
					<div class="status-item">
						<div class="status-dot"></div>
						<span>ONLINE</span>
					</div>
					<div class="status-item">
						<span>EST. 2024</span>
					</div>
				</div>
			</div>
		</div>
	`
}
Footer.define()
