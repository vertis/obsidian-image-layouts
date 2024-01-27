import { Plugin, type MarkdownPostProcessorContext } from "obsidian";

// Borrowed from https://github.com/agathauy/wikilinks-to-mdlinks-obsidian
const regexWiki = /\[\[([^\]]+)\]\]/;
const regexParenthesis = /\((.*?)\)/;
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g;
const regexMdGlobal = /\[([^\]]*)\]\(([^\(]*)\)/g;

// export type ImageLink =
//   | {
//       type: "local" | "external";
//       link: string;
//     }
//   | {
//       type: "placeholder";
//     };

export type ExternalImageLink = {
  type: "external";
  link: string;
};

export type WikiImageLink = {
  type: "wiki";
  link: string;
};

// export type PlaceholderImageLink = {
//   type: "placeholder";
//   link: string;
// };

export type ResolvedImageLink = {
  type: "resolved";
  link: string;
};

export type ImageLink = ExternalImageLink | WikiImageLink;
export type ReadyImageLink = ExternalImageLink | ResolvedImageLink;

const getImageFromLine = (line: string): ImageLink | null => {
  if (line.match(regexMdGlobal)) {
    const link = line.match(regexParenthesis)?.[1];
    if (link) {
      return { type: "external", link };
    }
  } else if (line.match(regexWikiGlobal)) {
    const link = line.match(regexWiki)?.[1];
    if (link) {
      return {
        type: "wiki",
        link: link,
      };
    }
  }
  return null;
};

export const getImages = (source: string): ImageLink[] => {
  const lines = source.split("\n").filter((row) => row.startsWith("!"));
  const images = lines.map((line) => getImageFromLine(line));
  return images.filter((image) => image !== null) as ImageLink[];
};

export function resolveLocalImages(
  images: ImageLink[],
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin
): ReadyImageLink[] {
  // 	var destFile = plugin.app.metadataCache.getFirstLinkpathDest(link, sourcePath);
  // if (destFile) {
  // 	const img = parent.createEl("img");
  // 	img.src = plugin.app.vault.adapter.getResourcePath(destFile.path);
  // }
  return images.map((image) => {
    if (image.type === "wiki") {
      const destFile = plugin.app.metadataCache.getFirstLinkpathDest(
        image.link,
        ctx.sourcePath
      );
      if (destFile) {
        return {
          type: "resolved",
          link: plugin.app.vault.adapter.getResourcePath(destFile.path),
        };
      }
    }
    return image as ReadyImageLink;
  });
}
