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
			top: 5rem;
			padding-bottom: 4rem;

			/*filter: url(#pixelate);*/
		}

		img {
			max-width: 200px;
			filter: grayscale(1) invert(1) brightness(1.2);
			margin-block: 1.75rem;
		}

		p {
			font-size: 1rem;
			opacity: .75;

			&.bold {
				opacity: .9;
				font-weight: 600;
			}

			&.footer {
				font-size: 1rem;
				font-weight: 200;
				line-height: 1;
			}

			& .name {
				color: #E282FF;
				font-size: 1.3rem;
			}
		}
	`]

	render = () => html`
		<div id="root" class="sticky">
		  <p class="bold">
			  Hi! I'm <span class="name font-pixel">Benton</span>, a software engineer based in Canada. Welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.
		  </p>
		  <p>
			  Throughout the past 5 years I have shipped many projects, working on everything from serverless audio processing backends to interactive 3d WebGL clients. During this time, I continuously refined my craft by sharpening my eye through the inspiring work of many other creative developers, designers, and 3D artists and working hard on my engineering skills to meet my ever-evolving taste in visual design.
		  </p>
		  <p>
			  My appetite for learning recently lead me to focus on what I believe is the future of the web: 3D, WebGL, and shaders.
		  </p>
		  <p>
			  When not building, I like sharing what I learned on my blog, through interactive experiences and playgrounds. You can also find me running in the streets of Victoria or just walking around enjoying a nice cup of coffee.
		  </p>
		  <img src="/sig.png">
		  <p class="footer font-pixel">
			  <span>Victoria, CA</span> <br>
			  <span>Oct 2025</span>
		  </p>
    <svg>
        <filter id="pixelate" x="0" y="0">
          <feFlood x="4" y="4" height="2" width="2"/>
          <feComposite width="10" height="10"/>
          <feTile result="a"/>
          <feComposite in="SourceGraphic" in2="a" operator="in"/>
          <feMorphology operator="dilate" radius="5"/>
        </filter>
      </svg>
		</div>
	`
}
AboutMe.define()
