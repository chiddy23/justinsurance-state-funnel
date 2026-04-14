import sharp from "sharp";

// Google requires favicon to be a multiple of 48px square.
// 192x192 (48*4) is the sweet spot — small enough to load fast, large enough to downscale cleanly to any SERP size.
await sharp("src/app/icon.png")
  .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/icon-192.png");

// Move 192 over the existing 256
import fs from "node:fs";
fs.renameSync("src/app/icon-192.png", "src/app/icon.png");

// Apple touch icon — Apple spec is 180x180, but also needs to be valid for Google fallback.
// 192 works for both.
await sharp("src/app/apple-icon.png")
  .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/apple-icon-180.png");
fs.renameSync("src/app/apple-icon-180.png", "src/app/apple-icon.png");

console.log("Resized:");
console.log("  src/app/icon.png → 192x192");
console.log("  src/app/apple-icon.png → 180x180");
