import { pathToFileURL } from "url";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import builtins from "builtin-modules";
import UnoCSS from "unocss/vite";
import { PluginOption, defineConfig } from "vite";

const setOutDir = (mode: string) => {
	switch (mode) {
		case "development":
			return "./test-vault/.obsidian/plugins/obsidian-svelte-plugin";
		case "production":
			return "build";
	}
};

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			UnoCSS(),
			svelte({ preprocess: vitePreprocess() }) as PluginOption,
		],
		build: {
			lib: {
				entry: "src/main",
				formats: ["cjs"],
			},
			rollupOptions: {
				output: {
					entryFileNames: "main.js",
					assetFileNames: "styles.css",
					sourcemapBaseUrl: pathToFileURL(
						`${__dirname}/test-vault/.obsidian/plugins/obsidian-svelte-plugin/`,
					).toString(),
				},
				external: [
					"obsidian",
					"electron",
					"@codemirror/autocomplete",
					"@codemirror/collab",
					"@codemirror/commands",
					"@codemirror/language",
					"@codemirror/lint",
					"@codemirror/search",
					"@codemirror/state",
					"@codemirror/view",
					"@lezer/common",
					"@lezer/highlight",
					"@lezer/lr",
					...builtins,
				],
			},
			outDir: setOutDir(mode),
			emptyOutDir: false,
			sourcemap: "inline",
		},
	};
});
