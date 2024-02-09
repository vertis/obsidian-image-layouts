import { Plugin } from "obsidian";
import "virtual:uno.css";
import { addLegacyImageLayoutMarkdownProcessors } from "./processors/legacy-image-layouts";
import { addLegacyMasonryMarkdownProcessors } from "./processors/legacy-masory-layouts";
import { settings as s } from "./stores";
import type { ImageLayoutsSettings } from "./types";
import { ImageLayoutsSettingsTab } from "./views/settings";

const DEFAULT_SETTINGS: ImageLayoutsSettings = {
  shouldOverlayPermanently: false,
};

export default class ImageLayoutsPlugin extends Plugin {
  settings!: ImageLayoutsSettings;
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    s.set(this.settings);
  }

  async saveSettings() {
    await this.saveData(this.settings);
    s.set(this.settings);
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new ImageLayoutsSettingsTab(this.app, this));

    addLegacyImageLayoutMarkdownProcessors(this);
    addLegacyMasonryMarkdownProcessors(this);
  }

  onunload() {
    console.log("unloading plugin");
  }
}
