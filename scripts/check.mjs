import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const html = await readFile("site/index.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (ids.length !== new Set(ids).size) throw new Error("Duplicate HTML ids");
for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if (target === "#") continue;
  if (target.startsWith("#")) {
    if (!ids.includes(target.slice(1)))
      throw new Error(`Missing anchor: ${target}`);
  } else if (!/^(https?:|mailto:|data:)/.test(target)) {
    await access(resolve("site", target.replace(/^\//, "")));
  }
}
for (const [, target] of html.matchAll(
  /\baria-(?:controls|labelledby)="([^"]+)"/g,
)) {
  for (const id of target.split(" "))
    if (!ids.includes(id)) throw new Error(`Missing ARIA target: ${id}`);
}
if (!html.includes('lang="ru"'))
  throw new Error("Missing Russian language declaration");
await access("site/assets/og.png");
console.log(
  "Local assets, anchors, unique IDs, social image and ARIA references checked.",
);
