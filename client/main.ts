import { WebGlScene } from "./webgl/webgl";
import { Footer } from "./footer";
import { Nav } from "./nav";
import { HomePage } from "./pages/home/home";

import "./assets/styles.css";

document.body.appendChild(document.createElement(Nav.tag));
document.body.appendChild(document.createElement(WebGlScene.tag));
document.body.appendChild(document.createElement(Footer.tag));
document.body.appendChild(document.createElement(HomePage.tag));
