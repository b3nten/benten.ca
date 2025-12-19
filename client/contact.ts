import { css, html } from "lit";
import { WebComponent } from "./component";

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
