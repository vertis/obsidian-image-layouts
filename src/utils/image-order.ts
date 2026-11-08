import { parseFrontMatterBlock } from "./front-matter";
import { getImageFromLine } from "./images";

export type DropPosition = "before" | "after";

export function getReorderDestination(
  sourceIndex: number,
  targetIndex: number,
  position: DropPosition,
): number {
  const insertionIndex = targetIndex + (position === "after" ? 1 : 0);
  return sourceIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
}

function moveItem<T>(
  items: T[],
  sourceIndex: number,
  targetIndex: number,
): T[] {
  const moved = [...items];
  const [item] = moved.splice(sourceIndex, 1);
  moved.splice(targetIndex, 0, item);
  return moved;
}

function imageLineIndexes(lines: string[], bodyStart: number): number[] {
  const indexes: number[] = [];
  for (let index = bodyStart; index < lines.length; index++) {
    if (lines[index].startsWith("!") && getImageFromLine(lines[index])) {
      indexes.push(index);
    }
  }
  return indexes;
}

function splitFlowItems(source: string): string[] | null {
  if (source.trim() === "") {
    return [];
  }
  const items: string[] = [];
  let start = 0;
  let depth = 0;
  let quote: '"' | "'" | null = null;
  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (quote === '"' && character === "\\") {
      index++;
      continue;
    }
    if (quote) {
      if (character === quote) {
        if (quote === "'" && source[index + 1] === "'") {
          index++;
        } else {
          quote = null;
        }
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "[" || character === "{") {
      depth++;
    } else if (character === "]" || character === "}") {
      depth--;
      if (depth < 0) {
        return null;
      }
    } else if (character === "," && depth === 0) {
      items.push(source.slice(start, index));
      start = index + 1;
    }
  }
  if (quote || depth !== 0) {
    return null;
  }
  items.push(source.slice(start));
  return items;
}

function reorderInlineDescriptions(
  lines: string[],
  keyIndex: number,
  imageCount: number,
  sourceIndex: number,
  targetIndex: number,
): string[] | null {
  const line = lines[keyIndex];
  const open = line.indexOf("[", line.indexOf(":"));
  const close = line.lastIndexOf("]");
  if (open < 0 || close < open) {
    return null;
  }
  const suffix = line.slice(close + 1).trim();
  if (suffix && !suffix.startsWith("#")) {
    return null;
  }
  const rawItems = splitFlowItems(line.slice(open + 1, close));
  if (!rawItems || rawItems.length === 0) {
    return rawItems ? lines : null;
  }
  const formats = rawItems.map((item) => ({
    leading: item.match(/^\s*/)?.[0] ?? "",
    trailing: item.match(/\s*$/)?.[0] ?? "",
  }));
  const items = rawItems.map((item) => item.trim());
  while (items.length < imageCount) {
    items.push("null");
  }
  const reordered = moveItem(items, sourceIndex, targetIndex);
  const inner = reordered
    .map((item, index) => {
      const format = formats[index] ?? { leading: " ", trailing: "" };
      return `${format.leading}${item}${format.trailing}`;
    })
    .join(",");
  const updated = [...lines];
  updated[keyIndex] = `${line.slice(0, open + 1)}${inner}${line.slice(close)}`;
  return updated;
}

function reorderBlockDescriptions(
  lines: string[],
  keyIndex: number,
  frontMatterEnd: number,
  imageCount: number,
  sourceIndex: number,
  targetIndex: number,
): string[] | null {
  const itemPattern = /^(\s*)-(?:\s+.*)?$/;
  let regionEnd = frontMatterEnd;
  for (let index = keyIndex + 1; index < frontMatterEnd; index++) {
    const line = lines[index];
    if (
      line &&
      !/^\s/.test(line) &&
      !line.startsWith("#") &&
      !itemPattern.test(line)
    ) {
      regionEnd = index;
      break;
    }
  }

  let itemIndent: string | null = null;
  for (let index = keyIndex + 1; index < regionEnd; index++) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }
    const match = line.match(itemPattern);
    if (!match) {
      return null;
    }
    if (itemIndent === null) {
      itemIndent = match[1];
    } else if (match[1] !== itemIndent) {
      return null;
    }
  }
  if (itemIndent === null) {
    return null;
  }

  const updated = [...lines];
  let itemIndexes = updated
    .slice(keyIndex + 1, regionEnd)
    .map((line, offset) => ({ line, index: keyIndex + 1 + offset }))
    .filter(({ line }) => itemPattern.test(line))
    .map(({ index }) => index);
  while (itemIndexes.length < imageCount) {
    const insertionIndex = itemIndexes[itemIndexes.length - 1] + 1;
    updated.splice(insertionIndex, 0, `${itemIndent}- null`);
    regionEnd++;
    itemIndexes = updated
      .slice(keyIndex + 1, regionEnd)
      .map((line, offset) => ({ line, index: keyIndex + 1 + offset }))
      .filter(({ line }) => itemPattern.test(line))
      .map(({ index }) => index);
  }
  const reordered = moveItem(
    itemIndexes.map((index) => updated[index]),
    sourceIndex,
    targetIndex,
  );
  for (const [position, index] of itemIndexes.entries()) {
    updated[index] = reordered[position];
  }
  return updated;
}

function reorderDescriptions(
  lines: string[],
  frontMatterEnd: number,
  imageCount: number,
  sourceIndex: number,
  targetIndex: number,
): string[] | null {
  const keyIndex = lines
    .slice(1, frontMatterEnd)
    .findIndex((line) => /^descriptions\s*:/.test(line));
  if (keyIndex < 0) {
    return null;
  }
  const index = keyIndex + 1;
  const value = lines[index].slice(lines[index].indexOf(":") + 1).trim();
  return value.startsWith("[")
    ? reorderInlineDescriptions(
        lines,
        index,
        imageCount,
        sourceIndex,
        targetIndex,
      )
    : reorderBlockDescriptions(
        lines,
        index,
        frontMatterEnd,
        imageCount,
        sourceIndex,
        targetIndex,
      );
}

export function reorderImagesInBlockSource(
  source: string,
  sourceIndex: number,
  targetIndex: number,
): string | null {
  const parsed = parseFrontMatterBlock<{ descriptions?: unknown }>(source);
  if (parsed.error) {
    return null;
  }
  const lines = source.split("\n");
  const bodyStart = (parsed.bodyBegin ?? 1) - 1;
  const frontMatterEnd = bodyStart - 1;
  const indexes = imageLineIndexes(lines, bodyStart);
  if (
    !Number.isInteger(sourceIndex) ||
    !Number.isInteger(targetIndex) ||
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= indexes.length ||
    targetIndex >= indexes.length
  ) {
    return null;
  }
  if (sourceIndex === targetIndex) {
    return source;
  }

  let updated = lines;
  const descriptions = parsed.data?.descriptions;
  if (
    frontMatterEnd > 0 &&
    Array.isArray(descriptions) &&
    descriptions.length > 0
  ) {
    const withDescriptions = reorderDescriptions(
      updated,
      frontMatterEnd,
      indexes.length,
      sourceIndex,
      targetIndex,
    );
    if (!withDescriptions) {
      return null;
    }
    updated = withDescriptions;
  }

  const updatedIndexes = imageLineIndexes(
    updated,
    bodyStart + updated.length - lines.length,
  );
  const reordered = moveItem(
    updatedIndexes.map((index) => updated[index]),
    sourceIndex,
    targetIndex,
  );
  for (const [position, index] of updatedIndexes.entries()) {
    updated[index] = reordered[position];
  }
  return updated.join("\n");
}
