import { Plugin } from "obsidian";
import "virtual:uno.css";
import {
  addLegacyMarkdownProcessors as addLegacyImageLayoutMarkdownProcessors,
  renderLegacyLayoutComponent,
} from "./processors/legacy-image-layouts";
import { addLegacyMasonryMarkdownProcessors } from "./processors/legacy-masory-layouts";

interface ObsidianNoteConnectionsSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianNoteConnectionsSettings = {
  mySetting: "default",
};

export default class ObsidianNoteConnections extends Plugin {
  settings!: ObsidianNoteConnectionsSettings;

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    await this.loadSettings();

    addLegacyImageLayoutMarkdownProcessors(this);
    addLegacyMasonryMarkdownProcessors(this);
  }

  onunload() {
    console.log("unloading plugin");
  }
}
