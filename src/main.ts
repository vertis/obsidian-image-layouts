import { getLinkpath, Plugin } from "obsidian";

// Borrowed from https://github.com/agathauy/wikilinks-to-mdlinks-obsidian
const regexWiki = /\[\[([^\]]+)\]\]/
const regexParenthesis = /\((.*?)\)/
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g
const regexMdGlobal = /\[([^\]]*)\]\(([^\(]*)\)/g

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
	images: ImageLink[],
	layout: string,
	sourcePath: string,
	parent: HTMLElement,
	plugin: Plugin) => {
	
	// add placeholders if images are missing
	const layoutImagesCount = layoutImages[layout];
	if (images.length < layoutImagesCount) {
		for (let i = images.length; i < layoutImagesCount; i++) {
			images.push({ type: 'placeholder' });
		}
	}
	if (images.length > layoutImagesCount) {
		images = images.slice(0, layoutImagesCount);
	}

	const div = parent.createEl("div", { cls: `beautiful-images-grid beautiful-images-layout-${layout}` });

	images.forEach((image, idx) => {
		const imgdiv = div.createEl("div", { cls: `beautiful-images-image-${idx}` });
		if (image.type === 'local') {
			addImageFromLink(image.link, sourcePath, imgdiv, plugin);
		} else if (image.type === 'placeholder') {
			addPlaceHolder('640x480', imgdiv);
		}
	});

	// addImageOrPlaceholder(images[0], sourcePath, div, plugin, 'beautiful-images-grid-area-feature')
	// for (let i = 1; i < layoutImages[layout]; i++) {
	// 	addImageOrPlaceholder(images[i], sourcePath, div, plugin)
	// }
}

const getImages = (source: string): ImageLink[] => {
	const lines = source.split('\n').filter((row) => row.startsWith('!'));
	const images = lines.map((line) => getImageFromLine(line));
	return images.filter((image) => image !== null) as ImageLink[];
}

type ImageLink = {
	type: 'local' | 'external';
	link: string;
} | {
	type: 'placeholder';
}

const getImageFromLine = (line: string): ImageLink | null => {
	if (line.match(regexMdGlobal)) {
		const link = line.match(regexParenthesis)?.[1];
		if (link) {
			return { type: 'external', link };
		}
	} else if (line.match(regexWikiGlobal)) {
		const link = line.match(regexWiki)?.[1];
		if (link) {
			return {
				type: 'local',
				link: link
			}
		}
	}
	return null;
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
