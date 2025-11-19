import { assert } from "@100x/engine/asserts";
import { isFunction } from "@100x/engine/checks";
import { createRequest, sendResponse } from "@remix-run/node-fetch-server";
import { readFileSync, rmSync } from "node:fs";
import { defineConfig, isRunnableDevEnvironment } from "vite";

const CLIENT_ENTRY = "client/main.js";
const SERVER_ENTRY = "server/main.js";

export default defineConfig({
	plugins: [manifest(), devServer()],
	appType: "custom",
	server: {
		port: 8000,
	},
	ssr: {
		target: "webworker",
		noExternal: true,
	},
	assetsInclude: ["**/*.glb"],
	environments: {
		ssr: {
			build: {
				emptyOutDir: false,
				copyPublicDir: false,
				rollupOptions: {
					input: {
						main: SERVER_ENTRY,
					},
					output: {
						dir: "dist",
						chunkFileNames: "server/[name].js",
					},
				},
			},
			consumer: "server",
		},
		client: {
			build: {
				emptyOutDir: false,
				manifest: true,
				outDir: "dist/public",
				rollupOptions: {
					input: {
						main: CLIENT_ENTRY,
					},
					output: {
						entryFileNames: "immutable/[name].[hash].js",
						chunkFileNames: "immutable/[name].[hash].js",
						assetFileNames: "immutable/[name].[hash][extname]",
						sourcemapFileNames: "immutable/[name].[hash].map",
					},
				},
			},
			consumer: "client",
		},
	},
	builder: {
		async buildApp(builder) {
			try {
				rmSync("dist");
			} catch {}
			await builder.build(builder.environments["client"]);
			await builder.build(builder.environments["ssr"]);
		},
	},
});

/** @returns { import("vite").PluginOption } */
function devServer() {
	return {
		name: "server-middleware",
		applyToEnvironment: (environment) => environment.name === "ssr",
		hotUpdate(ctx) {
			const { file, server } = ctx;
			const ssrGraph = server.environments.ssr?.moduleGraph;
			const ssrModule = ssrGraph?.getModuleById(file);
			if (ssrModule) {
				ctx.server.ws.send({
					type: "full-reload",
				});
			}
		},
		configureServer: (server) => {
			const env = server.environments["ssr"];
			assert(env, "Server environment not found");
			assert(
				isRunnableDevEnvironment(env),
				"Server environment is not runnable",
			);
			const runner = env.runner;
			return () => {
				server.middlewares.use(async (nodeRequest, nodeResponse, next) => {
					try {
						const mod = await runner.import(SERVER_ENTRY);
						const handler = isFunction(mod.default.fetch)
							? mod.default.fetch
							: mod.default;
						sendResponse(
							nodeResponse,
							await handler(createRequest(nodeRequest, nodeResponse)),
						);
					} catch (e) {
						next(e);
					}
				});
			};
		},
	};
}

/** @returns { import("vite").PluginOption } */
function manifest() {
	/** @type {string | null} */
	let m = null;
	return {
		name: "manifest-provider",
		resolveId(id) {
			if (id === "virtual:vite-manifest") {
				return "\0virtual:vite-manifest";
			}
		},
		load(id) {
			if (id === "\0virtual:vite-manifest") {
				if (m) return m;
				try {
					/** @type {import("vite").Manifest} */
					const rawManifest = JSON.parse(
						readFileSync("./dist/public/.vite/manifest.json", "utf-8"),
					);
					for (const key in rawManifest) {
						if (
							rawManifest[key].file &&
							!rawManifest[key].file.startsWith("/")
						) {
							rawManifest[key].file = "/" + rawManifest[key].file;
							if (Array.isArray(rawManifest[key].css)) {
								rawManifest[key].css = rawManifest[key].css.map((css) =>
									css.startsWith("/") ? css : "/" + css,
								);
							}
						}
					}
					m = `export default ${JSON.stringify(rawManifest)}`;
					rmSync("./dist/public/.vite", { recursive: true });
					return m;
				} catch {
					return (
						"export default " +
						JSON.stringify({
							[CLIENT_ENTRY]: {
								file: "/" + CLIENT_ENTRY,
								css: [],
							},
						})
					);
				}
			} else {
				return null;
			}
		},
	};
}
