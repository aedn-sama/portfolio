import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "app.js",
  "profile.js",
  "assets",
]) {
  await cp(file, `dist/${file}`, { recursive: true });
}
await cp(".nojekyll", "dist/.nojekyll");
console.log("Static portfolio built in dist/");
