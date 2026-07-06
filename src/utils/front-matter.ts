import fm from "front-matter";

export type FrontMatter = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

export const parseFrontMatterBlock = <T>(
  content: string,
): { data: T | null; body: string; error?: Error } => {
  try {
    const { attributes: data, body } = fm<T>(content);
    return { data, body };
  } catch (error) {
    // Keep the raw content as the body: image lines still render, and the
    // layout picker's writeback can't destroy what the user typed.
    return { data: null, body: content, error: error as Error };
  }
};

// Word-like strings YAML would misread as booleans/null if left unquoted.
const YAML_RESERVED = new Set([
  "true",
  "false",
  "yes",
  "no",
  "on",
  "off",
  "y",
  "n",
  "null",
]);

// Simple identifiers (layout: carousel, layout: legacy-layout-a) are written
// bare for readability and for naive downstream parsers like the published
// site script; everything else is JSON-encoded, which YAML parses unchanged
// since YAML is a superset of JSON.
const encodeYamlValue = (value: unknown): string => {
  if (
    typeof value === "string" &&
    /^[A-Za-z][A-Za-z0-9_-]*$/.test(value) &&
    !YAML_RESERVED.has(value.toLowerCase())
  ) {
    return value;
  }
  return JSON.stringify(value);
};

// Serializes a frontmatter block without gray-matter, whose top-level
// require("fs") made the bundle throw on Obsidian mobile (#20).
export const stringifyFrontMatterBlock = (
  body: string,
  data: Record<string, unknown>,
): string => {
  const yaml = Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${encodeYamlValue(value)}`)
    .join("\n");
  const normalizedBody =
    body === "" || body.endsWith("\n") ? body : `${body}\n`;
  return `---\n${yaml}\n---\n${normalizedBody}`;
};
