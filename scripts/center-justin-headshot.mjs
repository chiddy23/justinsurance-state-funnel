import sharp from "sharp";
import { fileURLToPath } from "node:url";

// Keep the original photograph intact. Mirror only its plain left backdrop to
// shift the subject into the center of a square search-result thumbnail.
const input = fileURLToPath(new URL("../public/headshot-justin.jpg", import.meta.url));
const output = fileURLToPath(new URL("../public/headshot-justin-centered.jpg", import.meta.url));
const shift = 65;
const { width, height } = await sharp(input).metadata();

if (width !== 800 || height !== 800) {
  throw new Error(`Unexpected headshot dimensions: ${width}x${height}`);
}

const leftBackdrop = await sharp(input)
  .extract({ left: 0, top: 0, width: shift, height })
  .flop()
  .toBuffer();
const originalPhoto = await sharp(input)
  .extract({ left: 0, top: 0, width: width - shift, height })
  .toBuffer();

await sharp({
  create: { width, height, channels: 3, background: "#5b5d61" },
})
  .composite([
    { input: leftBackdrop, left: 0, top: 0 },
    { input: originalPhoto, left: shift, top: 0 },
  ])
  .jpeg({ quality: 95, mozjpeg: true })
  .toFile(output);
