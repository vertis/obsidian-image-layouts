export type OverlayMode = "never" | "hover" | "always";

export type ImageLayoutsSettings = {
  // Pre-0.16 toggle, superseded by overlayMode. Kept (and mirrored on save)
  // so downgrading the plugin doesn't lose the user's preference.
  shouldOverlayPermanently: boolean;
  overlayMode: OverlayMode;
  placeholderImage: string;
};
