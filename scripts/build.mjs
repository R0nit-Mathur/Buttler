#!/usr/bin/env node
/**
 * Build the static deployment bundle.
 *
 * Vercel's Node runtime only traces files reachable from an entry module. The
 * clone's HTML, models, textures, fonts and videos are read dynamically at
 * runtime, so running `server.mjs` on Vercel produced a deployment that served
 * HTML but 404'd every asset. Deploying a plain directory of files instead
 * guarantees that Vercel uploads and serves the whole experience.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, "dist");

const EXCLUDE = new Set([
  ".git",
  ".gitignore",
  ".vercelignore",
  ".DS_Store",
  "dist",
  "reference",
  "scripts",
  "README.md",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "vercel.json",
]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let files = 0;
let bytes = 0;

function copy(entry) {
  const source = join(ROOT, entry);
  const target = join(OUT, entry);
  if (statSync(source).isDirectory()) {
    mkdirSync(target, { recursive: true });
    for (const child of readdirSync(source)) {
      if (child === ".DS_Store") continue;
      copy(join(entry, child));
    }
    return;
  }
  cpSync(source, target);
  files += 1;
  bytes += statSync(source).size;
}

for (const entry of readdirSync(ROOT)) {
  if (EXCLUDE.has(entry)) continue;
  copy(entry);
}

// GitHub Pages would skip `_next` without this; harmless on Vercel.
writeFileSync(join(OUT, ".nojekyll"), "");

console.log(
  `Built dist/ — ${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`,
);
