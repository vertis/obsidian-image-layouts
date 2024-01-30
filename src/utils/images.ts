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

export const getImageFromLine = (line: string): ImageLink | null => {
  if (line.match(regexMdGlobal)) {
    const link = line.match(regexParenthesis)?.[1];
    if (link) {
      if (link.toLowerCase().startsWith("http")) {
        return { type: "external", link };
      } else {
        return { type: "wiki", link };
      }
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
