import fm from "front-matter";

export type FrontMatter = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

export const parseFrontMatterBlock = <T>(
  content: string
): { data: T | null; body: string; error?: Error } => {
  try {
    const { attributes: data, body } = fm<T>(content);
    return { data, body };
  } catch (error) {
    return { data: null, body: "", error: error as Error };
  }
};
