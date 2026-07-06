# Changelog

## 0.16.0

The plugin was quietly broken in several long-standing ways — most notably it
never loaded on mobile at all. This release fixes every open bug and adds the
most-requested options.

### Fixed

- **The plugin now loads on Obsidian mobile.** The bundle contained a
  top-level `require("fs")` (via gray-matter) that threw before the plugin
  could enable on Android/iOS (#20). A build-time guard now prevents Node
  built-ins from ever sneaking back into the bundle.
- Wikilinks with captions or sizes — `![[image.jpg|caption]]`,
  `![[image.jpg|300]]` — no longer render broken images; the caption becomes
  the overlay text and the size caps the image width where the layout allows
  (#21, #22, #33).
- Percent-encoded paths (`Test%20folder/image.jpg`, as Obsidian inserts for
  markdown-style links) now resolve (#32).
- Alt text survives local-image resolution, so captions work for vault images
  the same as for remote URLs (#22).
- `file:///…` embeds are rewritten to Obsidian's resource scheme and display
  (#17).
- Images without a caption no longer get an automatic "Image 1", "Image 2"
  hover overlay (#31).
- Fullscreen image preview on mobile is no longer cropped — the plugin's crop
  styling no longer follows the image into Obsidian's image viewer (#28).
- Rendered components are destroyed when blocks re-render instead of leaking,
  which was degrading performance over time (#23).
- The empty-slot placeholder no longer depends on the defunct
  via.placeholder.com — it's an inline image, works offline, and is
  configurable in settings (#27).
- Fixed `layout: legacy-layout-single` rendering layout "e".
- Fixed carousel thumbnail strip touch scrolling.
- Captions follow the active theme instead of a fixed gray.

### Added

- `overlay: never | hover | always` per block, plus a global overlay mode
  setting (replacing the permanent-overlay toggle, which is migrated) (#26).
- Carousel: per-image captions, block caption, `carouselBackground` and
  `carouselHeight` options; theme-aware background by default (#14, #21).
- `fit: cover | contain | natural` for grid layouts (#16).
- `align` and `width` for single layouts, plus `image-layout-left`,
  `image-layout-center`, `image-layout-right` shorthand blocks (#6).
- `fromFolder` (+ `sortBy`, `reverse`, `limit`) to populate any layout from a
  vault folder (#30).
- Placeholder image setting: vault path or URL (#27).
- A full [block options reference](docs/options.md).

### Internal

- CI now runs lint, typecheck, unit tests, build, and a mobile-bundle guard on
  every push and PR; releases are gated on the same checks.
