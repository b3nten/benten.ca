import { assert } from "elysiatech/lib";
import { WebGlScene } from "./webgl";
import { Footer } from "./footer";
import { Nav } from "./nav";
import { HomePage } from "./pages/home/home";

import "./assets/styles.css";
import "@awesome.me/webawesome/dist/styles/webawesome.css";

document.body.appendChild(document.createElement(Nav.tag));
document.body.appendChild(document.createElement(WebGlScene.tag));
document.body.appendChild(document.createElement(Footer.tag));
document.body.appendChild(document.createElement(HomePage.tag));
