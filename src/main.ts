import { getLinkpath, Plugin } from "obsidian";

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

export default class BetterGalleryPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("better-gallery", (source, el, ctx) => {
    	const rows = source.split("\n").filter((row) => row.length > 0);

    	const div = el.createEl("div", { cls: 'image-grid' });

		for (var row of rows) {
			addImageFromLink(row, ctx.sourcePath, div, this);
		}

	});
	  
	this.registerMarkdownCodeBlockProcessor("better-gallery-two-up", (source, el, ctx) => {
		const rows = source.split("\n").filter((row) => row.length > 0);

		const div = el.createEl("div", { cls: 'image-two-up' });

		rows[0] ? addImageFromLink(rows[0], ctx.sourcePath, div, this) : addPlaceHolder("640x480", div);
		rows[1] ? addImageFromLink(rows[1], ctx.sourcePath, div, this) : addPlaceHolder("640x480", div);
	});
	  
	this.registerMarkdownCodeBlockProcessor("beautiful-images-feature-left", (source, el, ctx) => {
		const rows = source.split("\n").filter((row) => row.length > 0);

		const div = el.createEl("div", { cls: 'beautiful-images-feature-left' });

		const leftDiv = div.createEl("div", { cls: 'beautiful-images-feature-left-feature' });
		rows[0] ?
			addImageFromLink(rows[0], ctx.sourcePath, leftDiv, this) :
			addPlaceHolder("640x480", leftDiv);
		
		const right1Div = div.createEl("div");
		rows[1] ?
			addImageFromLink(rows[1], ctx.sourcePath, right1Div, this) :
			addPlaceHolder("640x480", right1Div);
		const right2Div = div.createEl("div");
		rows[2] ?
			addImageFromLink(rows[2], ctx.sourcePath, right2Div, this) :
			addPlaceHolder("640x480", right2Div);
    });
  }
}
