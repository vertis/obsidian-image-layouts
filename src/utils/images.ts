// Borrowed from https://github.com/agathauy/wikilinks-to-mdlinks-obsidian
const regexWiki = /\[\[([^\]]+)\]\]/;
// Alt and destination extracted together so parentheses elsewhere on the
// line can't hijack the link; the destination allows one level of nested
// parens for filenames like "Screenshot (1).png".
const regexMd = /\[([^\]]*)\]\(([^()]*(?:\([^()]*\)[^()]*)*)\)/;
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g;

export type ExternalImageLink = {
  type: "external";
  link: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type WikiImageLink = {
  type: "wiki";
  link: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ResolvedImageLink = {
  type: "resolved";
  link: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ImageLink = ExternalImageLink | WikiImageLink;
export type ReadyImageLink = ExternalImageLink | ResolvedImageLink;

type PipeAttributes = {
  alt?: string;
  width?: number;
  height?: number;
};

// Obsidian pipe syntax: ![[image.png|caption]], ![[image.png|300]],
// ![[image.png|300x200]], ![[image.png|caption|300]]. Numeric segments are
// size hints; anything else is display text.
const parsePipeSegments = (segments: string[]): PipeAttributes => {
  const attributes: PipeAttributes = {};
  const altParts: string[] = [];
  for (const segment of segments) {
    const trimmed = segment.trim();
    const size = trimmed.match(/^(\d+)(?:x(\d+))?$/);
    if (size) {
      attributes.width = Number(size[1]);
      if (size[2]) {
        attributes.height = Number(size[2]);
      }
    } else if (trimmed) {
      altParts.push(trimmed);
    }
  }
  if (altParts.length > 0) {
    attributes.alt = altParts.join("|");
  }
  return attributes;
};

// Obsidian percent-encodes markdown-style local paths (e.g. Test%20folder/img.jpg),
// but metadataCache.getFirstLinkpathDest expects decoded vault paths. A stray
// literal "%" in a hand-written path would make decodeURIComponent throw, so
// fall back to the raw string.
export const safeDecode = (link: string): string => {
  try {
    return decodeURIComponent(link);
  } catch {
    return link;
  }
};

export const getImageFromLine = (line: string): ImageLink | null => {
  const mdMatch = line.match(regexMd);
  if (mdMatch) {
    const altRaw = mdMatch[1] ?? "";
    const link = mdMatch[2];
    if (link) {
      const attributes = parsePipeSegments(altRaw.split("|"));
      if (link.toLowerCase().startsWith("http")) {
        return { type: "external", link, ...attributes };
      }
      // file:// links are classified as wiki here and rewritten to Obsidian's
      // resource scheme in resolveLocalImages; percent-encoded vault paths are
      // decoded there too.
      return { type: "wiki", link, ...attributes };
    }
  } else if (line.match(regexWikiGlobal)) {
    const embed = line.match(regexWiki)?.[1];
    if (embed) {
      const [link, ...pipeSegments] = embed.split("|");
      const attributes = parsePipeSegments(pipeSegments);
      if (link.trim()) {
        return { type: "wiki", link: link.trim(), ...attributes };
      }
    }
  }
  return null;
};

export const getImages = (source: string): ImageLink[] => {
  const lines = source.split("\n").filter((row) => row.startsWith("!"));
  const images = lines.map((line) => getImageFromLine(line));
  return images.filter((image) => image !== null) as ImageLink[];
};
