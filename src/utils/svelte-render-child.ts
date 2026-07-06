import { MarkdownRenderChild } from "obsidian";
import type { SvelteComponent } from "svelte";

// Obsidian re-runs codeblock post-processors freely (scrolling, edits, pane
// switches). Registering each Svelte component as a MarkdownRenderChild lets
// Obsidian call $destroy when the rendered block goes away, instead of
// accumulating orphaned component instances (#23).
export class SvelteRenderChild extends MarkdownRenderChild {
  private component: SvelteComponent;

  constructor(containerEl: HTMLElement, component: SvelteComponent) {
    super(containerEl);
    this.component = component;
  }

  onunload(): void {
    this.component.$destroy();
  }
}
