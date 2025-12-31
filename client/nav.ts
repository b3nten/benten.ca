import { css, html } from "lit";
import { WebComponent } from "./component";

export class Nav extends WebComponent("nav-bar")
{
	static styles = /*css*/ [super.styles, css`
		:host {
			display: block;
			position: fixed;
			top: 1rem;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			font-size: 1.25rem;
			font-weight: 300;
			color: white;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			user-select: none;
			& nav {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				padding: 0.2rem .75rem;
				background-color: #7240FF;
				line-height: 1;
			}
			& .bg {
				position: absolute;
				inset: -3px;
				background: linear-gradient(30deg, #AF82FF, #AF82FF);
				z-index: -1;
			}
			& .bg-glow {
				position: absolute;
				top: 3px;
				left: -2px;
				right: -2px;
				bottom: 3px;
				background: linear-gradient(30deg, #AF82FF, #E282FF);
				z-index: -2;
				filter: blur(15px);
			}
		}

		ul {
			list-style: none;
			display: flex;
			flex-direction: row;
			padding: 0;
			margin: 0;
			gap: 1.5rem;
		}

		li {
			cursor: pointer;
		}

		.logo {
			font-size: 1.5rem;
			cursor: pointer;
		}

		.sep {
			width: 1px;
			height: 1.2rem;
			background-color: rgba(255,255,255, .2);
			margin: 0 .9rem;
			backdrop-filter: blur(10px);
		}
	`]

	render = () => html`
		<nav class="font-pixel border-pixels-4">
			<a class="logo">B</a>
			<div class="sep"></div>
			<ul>
				<li>
					<a>Index</a>
				</li>
				<li>
					<a>About</a>
				</li>
				<li>
					<a>Work</a>
				</li>
				<li>
					<a>Contact</a>
				</li>
			</ul>
		</nav>
		<div class="bg border-pixels-4"></div>
		<div class="bg-glow"></div>
	`
}
