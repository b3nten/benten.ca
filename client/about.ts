import { css, html } from "lit";
import { WebComponent } from "./component";

export class AboutMe extends WebComponent("about-me")
{
	static styles = [super.styles, css`
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
				font-size: 1.2rem;
				font-weight: 200;
				line-height: 1;
			}

			& .name {
				color: #E282FF;
				font-size: 1.75rem;
			}
		}
	`]

	render = () => html`
		<div class="sticky">
		<p class="bold">
			Hi! I'm <span class="name font-pixel">Benton</span>, a fullstack engineer based in Canada. Welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.
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
		<p class="footer font-pixel">
			<span>Victoria, CA</span> <br>
			<span>Oct 2025</span>
		</p>
		</div>
	`
}
AboutMe.define()
