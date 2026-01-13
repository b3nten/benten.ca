import { css, html } from "lit";
import { WebComponent } from "./component";

export class Inspiration extends WebComponent("inspiration-block") {
  static styles = css`
    :host {
      display: block;
      position: relative;
      margin: auto;
      max-width: 769px;
    }
  `;

  render = () => html`
    <h2>Inspiration</h2>
    <p>
      My work doesn't happen in a vacuum. It is the result of being continuously
      exposed to the work and art of thousands of artists, designers, and
      creators. They influence my work a contribute to cultivating my own style,
      taste, and how I approach and solve problems.
    </p>
    <p>
      Below is a non-exhaustive curated snapshot of some of my favorite sources
      of inspiration that I've collected over the years.
    </p>
  `;
}
Inspiration.define();
