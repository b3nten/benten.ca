/// <reference types="vite/client" />

declare module "virtual:vite-manifest" {
	const manifest: import("vite").Manifest;
	export default manifest;
}
