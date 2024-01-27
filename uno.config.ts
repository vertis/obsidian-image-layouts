import { defineConfig } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
	presets: [presetUno()],
	extractors: [extractorSvelte()],
});
