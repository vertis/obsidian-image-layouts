import ImageLayoutsPlugin from "../main";
import { App, PluginSettingTab, Setting } from "obsidian";

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
      .setName("Should Overlay Permanently")
      .setDesc("Image overlays don't require hovering")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.shouldOverlayPermanently)
          .onChange(async (value) => {
            this.plugin.settings.shouldOverlayPermanently = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
