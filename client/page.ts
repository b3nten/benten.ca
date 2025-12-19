import { css, html } from "lit";
import { WebComponent } from "./component";

import "./about"
import "./contact"
import "./footer"
import "./hero"
import "./inspiration"
import "./work"

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
