import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const htmlPath = path.join(distDir, "index.html");

if (!existsSync(htmlPath)) {
  throw new Error("dist/index.html was not found. Run `vite build` first.");
}

let html = await fs.readFile(htmlPath, "utf8");

const stylesheetMatch = html.match(
  /<link rel="stylesheet"(?: crossorigin)? href="([^"]+)">/
);
if (stylesheetMatch) {
  const stylesheetPath = path.join(distDir, stylesheetMatch[1].replace(/^\//, ""));
  const stylesheet = await fs.readFile(stylesheetPath, "utf8");
  html = html.replace(stylesheetMatch[0], () => `<style>${stylesheet}</style>`);
}

const scriptMatch = html.match(
  /<script type="module"(?: crossorigin)? src="([^"]+)"><\/script>/
);
if (scriptMatch) {
  const scriptPath = path.join(distDir, scriptMatch[1].replace(/^\//, ""));
  const script = await fs.readFile(scriptPath, "utf8");
  html = html.replace(scriptMatch[0], () => `<script type="module">${script}</script>`);
}

html = html.replace(/<link rel="modulepreload"[^>]*>/g, "");

await fs.writeFile(htmlPath, html, "utf8");

const assetsDir = path.join(distDir, "assets");
if (existsSync(assetsDir)) {
  await fs.rm(assetsDir, { recursive: true, force: true });
}
