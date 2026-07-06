# Block Options Reference

Every layout block accepts options as YAML front matter inside the codeblock:

````
```image-layout-a
---
caption: A day at the beach
overlay: always
---
![[beach-1.jpg|Low tide]]
![[beach-2.jpg]]
```
````

## Image syntax

Images are listed one per line, in either format:

- `![[image.jpg]]` — wikilink to a vault image
- `![[image.jpg|My caption]]` — wikilink with a caption (shown as the overlay)
- `![[image.jpg|300]]` — Obsidian's size syntax; the number is used as a max
  width for the image where the layout allows it
- `![My caption](image.jpg)` — markdown link to a vault image (Obsidian's
  percent-encoded paths like `Test%20folder/image.jpg` work too)
- `![My caption](https://example.com/image.jpg)` — remote image
- `![](file:///absolute/path/image.jpg)` — image on disk outside the vault

## Options for all layouts

| Option | Values | Description |
| --- | --- | --- |
| `caption` | text | Caption rendered under the whole layout |
| `descriptions` | list of text | Per-image overlay text; overrides captions from the image lines |
| `overlay` | `never` / `hover` / `always` | When to show per-image overlays (defaults to the global setting) |
| `permanentOverlay` | `true` / `false` | Older spelling of `overlay: always` / `overlay: hover`; still supported |
| `fromFolder` | vault folder path | Also include every image directly inside the folder |
| `sortBy` | `name` / `mtime` | Sort order for `fromFolder` images (default `name`) |
| `reverse` | `true` / `false` | Reverse the `fromFolder` sort order |
| `limit` | number | Cap the number of `fromFolder` images |

## Options for grid layouts (`image-layout-a` … `image-layout-i`, `image-layout-single`)

| Option | Values | Description |
| --- | --- | --- |
| `fit` | `cover` / `contain` / `natural` | How images fill their grid cell. `cover` (default) crops to fill, `contain` letterboxes, `natural` keeps the intrinsic aspect ratio |
| `align` | `left` / `center` / `right` / `full` | Horizontal placement of the layout (most useful with `single`) |
| `width` | number (px) or CSS size like `40%` | Width of the layout when `align` is set (default `50%`) |

`image-layout-left`, `image-layout-center` and `image-layout-right` are
shorthands for a single image aligned to that side:

````
```image-layout-right
![[portrait.jpg]]
```
````

## Options for the carousel (`image-layout` with `layout: carousel`)

| Option | Values | Description |
| --- | --- | --- |
| `carouselShowThumbnails` | `true` / `false` | Thumbnail strip instead of pill buttons |
| `carouselBackground` | CSS color | Background of the carousel frame (defaults to the theme's secondary background) |
| `carouselHeight` | number (px) or CSS size like `60vh` | Height of the image stage (default `24rem`) |

Per-image captions (from `![[image.jpg|caption]]`, markdown alt text, or
`descriptions`) are shown under the current slide.

## Populating from a folder

````
```image-layout-masonry-3
---
fromFolder: Holidays/2024/attachments
sortBy: mtime
reverse: true
limit: 12
---
```
````

Images listed in the block body come first, then the folder images.

## Settings

- **Overlay mode** — global default for `overlay` (never / hover / always)
- **Placeholder image** — vault path or `https://` URL used to fill layouts
  that have fewer images than they need; empty uses a built-in placeholder
