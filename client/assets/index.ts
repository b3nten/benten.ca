import { AssetLoader, GLTFAsset } from "elysiatech";

GLTFAsset.setDracoDecoderPath("/draco/")

import monitorUrl from "./models/Monitor.glb"
import terminalUrl from "./models/Terminal.glb";

export const globalAssets = new AssetLoader({
	monitor: new GLTFAsset(monitorUrl),
 	terminal: new GLTFAsset(terminalUrl),
})
