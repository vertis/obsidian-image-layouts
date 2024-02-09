import { writable } from "svelte/store";
import type { ImageLayoutsSettings } from "./types";

export const settings = writable<ImageLayoutsSettings>({
  shouldOverlayPermanently: false,
});
