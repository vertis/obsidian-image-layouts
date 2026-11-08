import { Platform } from "obsidian";
import { get } from "svelte/store";
import { settings } from "../stores";
import type { ReorderModifier } from "../types";
import type { DropPosition } from "./image-order";

const REORDER_MIME = "application/x-obsidian-image-layout-reorder";
let activeDragRoot: Element | null = null;

export type ImageReorderDetail = {
  sourceIndex: number;
  targetIndex: number;
  position: DropPosition;
};

type ReorderOptions = {
  index: number;
  enabled: boolean;
  orientation: "horizontal" | "vertical";
  onReorder: (detail: ImageReorderDetail) => void;
};

type ModifierEvent = Pick<
  DragEvent,
  "ctrlKey" | "metaKey" | "altKey" | "shiftKey"
>;

export function hasReorderModifier(
  event: ModifierEvent,
  modifier: ReorderModifier,
): boolean {
  if (modifier === "none") {
    return true;
  }
  const effective =
    modifier === "default" ? (Platform.isMacOS ? "meta" : "ctrl") : modifier;
  switch (effective) {
    case "ctrl":
      return event.ctrlKey;
    case "meta":
      return event.metaKey;
    case "alt":
      return event.altKey;
    case "shift":
      return event.shiftKey;
  }
}

function modifierLabel(modifier: ReorderModifier): string {
  if (modifier === "default") {
    return Platform.isMacOS ? "Cmd" : "Ctrl";
  }
  if (modifier === "meta" && Platform.isMacOS) {
    return "Cmd";
  }
  return modifier[0].toUpperCase() + modifier.slice(1);
}

function hasReorderType(dataTransfer: DataTransfer): boolean {
  return Array.from(dataTransfer.types).includes(REORDER_MIME);
}

export function reorderImage(node: HTMLElement, options: ReorderOptions) {
  let current = options;
  let reorderModifier = get(settings).reorderModifier;
  const layoutRoot = node.closest(".switchable-layout");
  const indicator = document.createElement("div");
  indicator.style.position = "absolute";
  indicator.style.background = "var(--interactive-accent)";
  indicator.style.pointerEvents = "none";
  indicator.style.zIndex = "50";

  function clearIndicator() {
    indicator.remove();
  }

  function finishDrag() {
    clearIndicator();
    if (layoutRoot === activeDragRoot) {
      activeDragRoot = null;
    }
  }

  function showIndicator(event: DragEvent): DropPosition {
    const rect = node.getBoundingClientRect();
    const before =
      current.orientation === "horizontal"
        ? event.clientX < rect.left + rect.width / 2
        : event.clientY < rect.top + rect.height / 2;
    indicator.style.left = "";
    indicator.style.right = "";
    indicator.style.top = "";
    indicator.style.bottom = "";
    indicator.style.width = "";
    indicator.style.height = "";
    if (current.orientation === "horizontal") {
      indicator.style.top = "0";
      indicator.style.bottom = "0";
      indicator.style.width = "3px";
      indicator.style[before ? "left" : "right"] = "-4px";
    } else {
      indicator.style.left = "0";
      indicator.style.right = "0";
      indicator.style.height = "3px";
      indicator.style[before ? "top" : "bottom"] = "-4px";
    }
    node.appendChild(indicator);
    return before ? "before" : "after";
  }

  function updateTitle() {
    if (current.enabled && Platform.isDesktop) {
      node.title =
        reorderModifier === "none"
          ? "Drag to reorder"
          : `${modifierLabel(reorderModifier)} + drag to reorder`;
    } else {
      node.removeAttribute("title");
      clearIndicator();
    }
  }

  const unsubscribe = settings.subscribe((value) => {
    reorderModifier = value.reorderModifier;
    updateTitle();
  });

  function update(next: ReorderOptions) {
    current = next;
    updateTitle();
  }

  function dragStart(event: DragEvent) {
    if (
      !current.enabled ||
      !Platform.isDesktop ||
      !hasReorderModifier(event, reorderModifier)
    ) {
      return;
    }
    const dragRoot = layoutRoot;
    if (!event.dataTransfer || !dragRoot) {
      return;
    }
    activeDragRoot = dragRoot;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(REORDER_MIME, String(current.index));
    event.stopPropagation();
  }

  function dragOver(event: DragEvent) {
    if (
      !event.dataTransfer ||
      !hasReorderType(event.dataTransfer) ||
      !current.enabled ||
      layoutRoot !== activeDragRoot
    ) {
      return;
    }
    if (!hasReorderModifier(event, reorderModifier)) {
      clearIndicator();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    showIndicator(event);
  }

  function dragLeave(event: DragEvent) {
    if (
      !(event.relatedTarget instanceof Node) ||
      !node.contains(event.relatedTarget)
    ) {
      clearIndicator();
    }
  }

  function drop(event: DragEvent) {
    if (
      !event.dataTransfer ||
      !hasReorderType(event.dataTransfer) ||
      layoutRoot !== activeDragRoot
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const position = showIndicator(event);
    clearIndicator();
    if (!current.enabled || !hasReorderModifier(event, reorderModifier)) {
      return;
    }
    const rawSourceIndex = event.dataTransfer.getData(REORDER_MIME);
    if (rawSourceIndex === "") {
      return;
    }
    const sourceIndex = Number(rawSourceIndex);
    if (!Number.isInteger(sourceIndex)) {
      return;
    }
    current.onReorder({ sourceIndex, targetIndex: current.index, position });
  }

  node.addEventListener("dragstart", dragStart);
  node.addEventListener("dragover", dragOver);
  node.addEventListener("dragleave", dragLeave);
  node.addEventListener("drop", drop);
  document.addEventListener("dragend", finishDrag);
  document.addEventListener("drop", finishDrag);
  update(options);

  return {
    update,
    destroy() {
      node.removeEventListener("dragstart", dragStart);
      node.removeEventListener("dragover", dragOver);
      node.removeEventListener("dragleave", dragLeave);
      node.removeEventListener("drop", drop);
      document.removeEventListener("dragend", finishDrag);
      document.removeEventListener("drop", finishDrag);
      unsubscribe();
      finishDrag();
    },
  };
}
