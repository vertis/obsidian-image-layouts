# Changelog

## 0.18.0

### Added

- **Custom layouts** (#15): `layout: custom` with an ASCII-art `grid` —
  rows of letters where equal letters merge into one region and `.` leaves
  a cell empty:

  ```
  layout: custom
  grid: |
    A A B
    A A C
  ```

  Letters map to your images in order of first appearance. Invalid grids
  (ragged rows, non-rectangular regions) render a friendly message instead
  of nothing. The picker gets a "custom" tile that seeds a starter grid,
  and published sites render custom layouts too.

## 0.17.0

You never need to memorize a layout letter again.

### Added

- **Visual layout picker**: an empty `image-layout` block now shows every
  layout — grids a–i, single, masonry 2–6, and both carousel variants — as
  small visual schematics instead of two text cards. Layouts that fit the
  number of images already in the block are highlighted, and the picker
  follows your theme.
- **Change layout in place**: rendered layouts show a small button on hover
  (faintly visible on touch devices) that reopens the picker. Modern blocks
  rewrite their `layout` option; legacy blocks rename the fence
  (`image-layout-a` → `image-layout-masonry-3`), so your documents keep
  their format.
- **Insert image layout command**: pick a layout from a modal and insert the
  block at the cursor — or select image lines first and the command wraps
  them. Works in source mode and on mobile.
- The modern `image-layout` block now renders masonry too:
  `layout: masonry-2` … `layout: masonry-6`.

### Fixed

- Choosing a layout when the block position can't be resolved (embeds,
  exports) now shows a notice instead of silently doing nothing.

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
