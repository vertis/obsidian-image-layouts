import { App, PluginSettingTab, Setting } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import type { OverlayMode, ReorderModifier } from "../types";

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
      .setName("Drag-to-reorder modifier")
      .setDesc(
        "Modifier to hold while dragging an image to reorder it. Choose None to drag directly without a modifier.",
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            none: "None (drag directly)",
            default: "Platform default (Cmd on macOS, Ctrl elsewhere)",
            ctrl: "Ctrl",
            meta: "Meta / Cmd / Windows",
            alt: "Alt",
            shift: "Shift",
          })
          .setValue(this.plugin.settings.reorderModifier)
          .onChange(async (value) => {
            this.plugin.settings.reorderModifier = value as ReorderModifier;
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
