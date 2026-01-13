import { css } from "lit";
import { WebComponent } from "../../component";

export class Hero extends WebComponent("hero-block") {
    static styles = css`
        :host {
            display: block;
            position: relative;
            height: 200vh;
            width: 100vw;
        }
    `;
}
Hero.define();
