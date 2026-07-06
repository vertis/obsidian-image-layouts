// Guards against Node built-ins sneaking into the bundle. Obsidian mobile
// runs in a plain webview with no Node runtime, so any require() other than
// "obsidian" throws at load time and the plugin silently never enables (#20).
import { readFileSync } from "node:fs";

const ALLOWED = new Set(["obsidian", "electron"]);

const bundle = readFileSync(new URL("../build/main.js", import.meta.url), "utf8");
const requires = [...bundle.matchAll(/require\(["']([^"')]+)["']\)/g)].map(
  (match) => match[1],
);
const forbidden = [...new Set(requires.filter((name) => !ALLOWED.has(name)))];

if (forbidden.length > 0) {
  console.error(
    `Forbidden require() in build/main.js (breaks Obsidian mobile): ${forbidden.join(", ")}`,
  );
  process.exit(1);
}
console.log(`Bundle OK: requires only ${[...new Set(requires)].join(", ") || "nothing"}`);
