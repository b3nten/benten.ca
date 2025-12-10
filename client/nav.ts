import { css, html } from "lit";
import { WebComponent } from "./component";

export class Nav extends WebComponent("nav-bar")
{
	static styles = /*css*/css`
		:host {
			display: block;
			position: fixed;
			top: 1rem;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			font-size: .9rem;
			font-weight: 600;
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
				padding: 0.2rem .5rem;
				background-color: rgba(100, 100, 200, 0.3);
				border-radius: 10px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				backdrop-filter: blur(10px);
				line-height: 1;
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
	`;

	render = () => html`
		<nav>
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
	`
}
