import { getLinkpath, Plugin } from "obsidian";

export default class BetterGalleryPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("better-gallery", (source, el, ctx) => {
    	const rows = source.split("\n").filter((row) => row.length > 0);

    	const div = el.createEl("div", { cls: 'image-grid' });

		for (var row of rows) {
			console.log(getLinkpath(row))
			var destFile = app.metadataCache.getFirstLinkpathDest(row, ctx.sourcePath);
			if (destFile) {
				const img = div.createEl("img");
				img.src = this.app.vault.adapter.getResourcePath(destFile.path);
			}
		}
		for (var row of rows) {
			console.log(getLinkpath(row))
			var destFile = app.metadataCache.getFirstLinkpathDest(row, ctx.sourcePath);
			if (destFile) {
				const img = div.createEl("img");
				img.src = this.app.vault.adapter.getResourcePath(destFile.path);
			}
		}
    });
  }
}
