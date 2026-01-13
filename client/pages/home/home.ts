import { css, html } from "lit";
import { WebComponent } from "../../component";

import cod from "../../assets/work/CallOfDuty/images";
import codMeta from "../../assets/work/CallOfDuty/content.json";
import chefsTable from "../../assets/work/ChefsTable/images";
import chefsTableMeta from "../../assets/work/ChefsTable/content.json";

import "./about";
import "./hero";
import "./inspiration";
import "./work";

export class HomePage extends WebComponent("home-page") {
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
        section {
            margin-bottom: 8rem;
        }
    `;

    render = () => html`
        <hero-block></hero-block>
        <main>
            <about-me></about-me>
            <work-compilation></work-compilation>
            <section>
                <project-summary header="Call of Duty: Black Ops 6">
                    ${codMeta.overview}
                </project-summary>
                <image-grid style="--columns: 8">
                    <grid-image
                        span="3"
                        src="${cod[2].src}"
                        alt="${cod[2].alt}"
                    ></grid-image>
                    <grid-image
                        span="5"
                        src="${cod[1].src}"
                        alt="${cod[1].alt}"
                    ></grid-image>
                    <grid-image
                        span="5"
                        src="${cod[0].src}"
                        alt="${cod[0].alt}"
                    ></grid-image>
                    <grid-image
                        span="3"
                        src="${cod[3].src}"
                        alt="${cod[3].alt}"
                    ></grid-image>
                </image-grid>
            </section>
            <section>
                <project-summary header="Chefs Table">
                    ${chefsTableMeta.overview}
                </project-summary>
                <image-grid style="--columns: 8">
                    <grid-image
                        span="3"
                        src="${chefsTable[2].src}"
                        alt="${chefsTable[2].alt}"
                    ></grid-image>
                    <grid-image
                        span="5"
                        src="${chefsTable[1].src}"
                        alt="${chefsTable[1].alt}"
                    ></grid-image>
                    <grid-image
                        span="5"
                        src="${chefsTable[0].src}"
                        alt="${chefsTable[0].alt}"
                    ></grid-image>
                    <grid-image
                        span="3"
                        src="${chefsTable[3].src}"
                        alt="${chefsTable[3].alt}"
                    ></grid-image>
                </image-grid>
            </section>
        </main>
        <footer-window></footer-window>
    `;
}
HomePage.define();
