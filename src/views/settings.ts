import { App, PluginSettingTab, Setting } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import type { OverlayMode } from "../types";

export class ImageLayoutsSettingsTab extends PluginSettingTab {
  plugin: ImageLayoutsPlugin;

  constructor(app: App, plugin: ImageLayoutsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Overlay mode")
      .setDesc(
        "When to show image description overlays. Individual blocks can override this with the overlay option.",
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            hover: "On hover",
            always: "Always",
            never: "Never",
          })
          .setValue(this.plugin.settings.overlayMode)
          .onChange(async (value) => {
            this.plugin.settings.overlayMode = value as OverlayMode;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Placeholder image")
      .setDesc(
        "Vault path or https:// URL shown when a layout has fewer images than it needs. Leave empty for the built-in placeholder.",
      )
      .addText((text) => {
        text
          .setPlaceholder("attachments/placeholder.png")
          .setValue(this.plugin.settings.placeholderImage)
          .onChange(async (value) => {
            this.plugin.settings.placeholderImage = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
