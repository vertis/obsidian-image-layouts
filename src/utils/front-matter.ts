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
    return { data: null, body: "", error: error as Error };
  }
};

// Serializes a frontmatter block without gray-matter, whose top-level
// require("fs") made the bundle throw on Obsidian mobile (#20). YAML is a
// superset of JSON, so JSON-encoding each value always emits valid YAML that
// parseFrontMatterBlock reads back unchanged.
export const stringifyFrontMatterBlock = (
  body: string,
  data: Record<string, unknown>,
): string => {
  const yaml = Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  const normalizedBody =
    body === "" || body.endsWith("\n") ? body : `${body}\n`;
  return `---\n${yaml}\n---\n${normalizedBody}`;
};
