import type { AlignMode } from "../interfaces";

// YAML lets users hand us anything: `descriptions:` with no value is null,
// a plain string indexes by character, sparse lists contain nulls. Normalize
// to an array where missing entries stay undefined so the per-image alt
// fallback still applies.
export const normalizeDescriptions = (
  value: unknown,
): (string | undefined)[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => (item == null ? undefined : String(item)));
};

const ALIGN_MODES: readonly string[] = ["left", "center", "right", "full"];

export const normalizeAlign = (
  value: unknown,
  fallback: AlignMode = "full",
): AlignMode =>
  typeof value === "string" && ALIGN_MODES.includes(value)
    ? (value as AlignMode)
    : fallback;
