import { Plugin } from "obsidian";
import { addImageLayoutMarkdownProcessor } from "./processors/image-layout";
import { addLegacyImageLayoutMarkdownProcessors } from "./processors/legacy-image-layouts";
import { addLegacyMasonryMarkdownProcessors } from "./processors/legacy-masory-layouts";
import { settings as s } from "./stores";
import type { ImageLayoutsSettings } from "./types";
import { buildLayoutBlock } from "./utils/blocks";
import { getImages } from "./utils/images";
import { ImageLayoutPickerModal } from "./views/picker-modal";
import { ImageLayoutsSettingsTab } from "./views/settings";
import "virtual:uno.css";

const DEFAULT_SETTINGS: ImageLayoutsSettings = {
  shouldOverlayPermanently: false,
  overlayMode: "hover",
  placeholderImage: "",
};

export default class ImageLayoutsPlugin extends Plugin {
  settings!: ImageLayoutsSettings;
  async loadSettings() {
    const saved: Partial<ImageLayoutsSettings> = (await this.loadData()) ?? {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    // Migrate settings saved before overlayMode existed.
    if (saved.overlayMode === undefined && saved.shouldOverlayPermanently) {
      this.settings.overlayMode = "always";
    }
    s.set(this.settings);
  }

  async saveSettings() {
    // Keep the legacy toggle in sync so a downgrade keeps the preference.
    this.settings.shouldOverlayPermanently =
      this.settings.overlayMode === "always";
    await this.saveData(this.settings);
    s.set(this.settings);
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new ImageLayoutsSettingsTab(this.app, this));

    this.addCommand({
      id: "insert-image-layout",
      name: "Insert image layout",
      icon: "layout-grid",
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        const imageCount = getImages(selection).length;
        new ImageLayoutPickerModal(this.app, imageCount, (choice) => {
          // A fence that starts mid-line isn't parsed as a codeblock.
          const from = editor.getCursor("from");
          const beforeCursor = editor.getLine(from.line).slice(0, from.ch);
          const prefix = beforeCursor.trim() === "" ? "" : "\n";
          editor.replaceSelection(prefix + buildLayoutBlock(choice, selection));
        }).open();
      },
    });

    addImageLayoutMarkdownProcessor(this);
    addLegacyImageLayoutMarkdownProcessors(this);
    addLegacyMasonryMarkdownProcessors(this);
  }

  onunload() {}
}
