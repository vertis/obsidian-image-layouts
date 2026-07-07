// Parses the ASCII-art `grid` option for `layout: custom` blocks into a CSS
// grid template. Rows are whitespace-separated tokens; equal tokens merge
// into one region, "." leaves a cell empty:
//
//   grid: |
//     A A B
//     A A C
//
// maps token A → image 1, B → image 2, C → image 3 (order of first
// appearance) and becomes grid-template-areas.

export type CustomGrid = {
  columns: number;
  rows: number;
  slots: number;
  templateAreas: string;
};

export type CustomGridResult =
  | { grid: CustomGrid; error?: undefined }
  | { grid?: undefined; error: string };

const MAX_SLOTS = 20;

export function parseCustomGrid(spec: unknown): CustomGridResult {
  if (typeof spec !== "string" || spec.trim() === "") {
    return {
      error:
        "A custom layout needs a `grid` option with rows of letters, e.g.\ngrid: |\n  A A B\n  A A C",
    };
  }
  const rows = spec
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.split(/\s+/));

  const columns = rows[0].length;
  if (rows.some((row) => row.length !== columns)) {
    return { error: "Every row in `grid` must have the same number of cells." };
  }

  const order: string[] = [];
  for (const row of rows) {
    for (const cell of row) {
      if (cell !== "." && !order.includes(cell)) {
        order.push(cell);
      }
    }
  }
  if (order.length === 0) {
    return { error: "The `grid` needs at least one image cell." };
  }
  if (order.length > MAX_SLOTS) {
    return { error: `\`grid\` supports up to ${MAX_SLOTS} images.` };
  }

  // CSS grid-template-areas requires each named area to be a solid
  // rectangle; validate here so a bad grid gets a readable message instead
  // of the browser silently discarding the whole template.
  for (const token of order) {
    let minRow = Number.POSITIVE_INFINITY;
    let maxRow = -1;
    let minCol = Number.POSITIVE_INFINITY;
    let maxCol = -1;
    let count = 0;
    for (const [r, row] of rows.entries()) {
      for (const [c, cell] of row.entries()) {
        if (cell === token) {
          minRow = Math.min(minRow, r);
          maxRow = Math.max(maxRow, r);
          minCol = Math.min(minCol, c);
          maxCol = Math.max(maxCol, c);
          count++;
        }
      }
    }
    if (count !== (maxRow - minRow + 1) * (maxCol - minCol + 1)) {
      return { error: `The cells for "${token}" must form a solid rectangle.` };
    }
  }

  const templateAreas = rows
    .map(
      (row) =>
        `"${row
          .map((cell) => (cell === "." ? "." : `image-${order.indexOf(cell)}`))
          .join(" ")}"`,
    )
    .join(" ");

  return {
    grid: {
      columns,
      rows: rows.length,
      slots: order.length,
      templateAreas,
    },
  };
}

// The starter grid written when the user picks "Custom" from the picker.
export const STARTER_GRID_LINES = ["grid: |", "  A A B", "  A A C"];
