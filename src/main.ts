import { getLinkpath, Plugin } from "obsidian";

const layoutImages: Record<string, number> = {
	'a': 2,
	'b': 2,
	'c': 3,
	'd': 3,
	'e': 4,
	'f': 4,
}

const addImageFromLink = (link: string, sourcePath: string, parent: HTMLElement, plugin: Plugin) => {
	var destFile = app.metadataCache.getFirstLinkpathDest(link, sourcePath);
	if (destFile) {
		const img = parent.createEl("img");
		img.src = plugin.app.vault.adapter.getResourcePath(destFile.path);
	}
}

const addPlaceHolder = (widthXHeight: string, parent: HTMLElement) => {
	widthXHeight = widthXHeight ?? "640x480";
	const img = parent.createEl("img");
	img.src = `https://via.placeholder.com/${widthXHeight}`;
}

const addImageOrPlaceholder = (link: string | undefined, sourcePath: string, parent: HTMLElement, plugin: Plugin, divCls?: string) => {
	const div = parent.createEl("div", { cls: divCls });
	if (link) {
		addImageFromLink(link, sourcePath, div, plugin);
	} else {
		addPlaceHolder('640x480', div);
	}
}

const renderLayout = (
	images: string[],
	layout: string,
	sourcePath: string,
	parent: HTMLElement,
	plugin: Plugin) => {
			

	const div = parent.createEl("div", { cls: `beautiful-images-grid beautiful-images-layout-${layout}` });

	addImageOrPlaceholder(images[0], sourcePath, div, plugin, 'beautiful-images-grid-area-feature')
	for (let i = 1; i < layoutImages[layout]; i++) {
		addImageOrPlaceholder(images[i], sourcePath, div, plugin)
	}
}

const getImages = (source: string) => {
	const lines = source.split('\n').filter((row) => row.startsWith('!'));
	const images = lines.map((line) => line.replace(/!\[\[(.+)\]\]/, '$1'))
	console.log(images);
	return images;
}

export default class BeautifulImagesPlugin extends Plugin {
  async onload() {
	Object.keys(layoutImages).forEach((layout) => {
		this.registerMarkdownCodeBlockProcessor(`beautiful-images-layout-${layout}`, (source, el, ctx) => {
			console.log(`beautiful-images-layout-${layout}`);
			const images = getImages(source);
			renderLayout(images, layout, ctx.sourcePath, el, this);
		});
	});
  }
}
