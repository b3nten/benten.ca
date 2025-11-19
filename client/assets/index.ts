import { AssetLoader, Asset } from "@100x/engine/assets";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import {
	type GLTF,
	GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";

import sceneAssetUrl from "./scene.glb"

type GLTFAssetType = {
	gltf: GLTF;
	clone: () => GLTF["scene"];
};

export class GLTFAsset extends Asset<GLTFAssetType> {
	static GLTFLoader: GLTFLoader = new GLTFLoader();
	static DracoLoader: DRACOLoader = new DRACOLoader();
	static setDracoDecoderPath(path: string) {
		GLTFAsset.DracoLoader.setDecoderPath(path);
		GLTFAsset.GLTFLoader.setDRACOLoader(GLTFAsset.DracoLoader);
	}
	url: string
	constructor(url: string) {
		super();
		this.url = url;
	}
	override loadImpl(): Promise<GLTFAssetType> {
		return new Promise<GLTFAssetType>((resolve, reject) => {
			GLTFAsset.GLTFLoader.load(
				this.url,
				(gltf) => resolve({ gltf: gltf, clone: () => gltf.scene.clone(true) }),
				undefined,
				reject,
			);
		});
	}
}

export const globalAssets = new AssetLoader({
	scene: new GLTFAsset(sceneAssetUrl)
})
