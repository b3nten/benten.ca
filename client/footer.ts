import { css, html } from "lit"
import { WebComponent } from "./component"

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
