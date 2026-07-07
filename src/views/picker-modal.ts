import { App, Modal } from "obsidian";
import LayoutPicker from "../components/LayoutPicker.svelte";
import type { PickerChoice } from "../interfaces";

export class ImageLayoutPickerModal extends Modal {
  private component: LayoutPicker | null = null;
  private imageCount: number;
  private onChoose: (choice: PickerChoice) => void;

  constructor(
    app: App,
    imageCount: number,
    onChoose: (choice: PickerChoice) => void,
  ) {
    super(app);
    this.imageCount = imageCount;
    this.onChoose = onChoose;
  }

  onOpen() {
    this.titleEl.setText("Insert image layout");
    this.component = new LayoutPicker({
      target: this.contentEl,
      props: {
        imageCount: this.imageCount,
        allowCarousel: true,
      },
    });
    this.component.$on(
      "layout-selected",
      (event: CustomEvent<PickerChoice>) => {
        this.close();
        this.onChoose(event.detail);
      },
    );
  }

  onClose() {
    this.component?.$destroy();
    this.component = null;
    this.contentEl.empty();
  }
}
