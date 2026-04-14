import pngToIco from "png-to-ico";
import fs from "node:fs";
import sharp from "sharp";

// Build multi-size ICO (16, 32, 48) from the 192 master.
const sizes = [16, 32, 48];
const buffers = await Promise.all(
  sizes.map((s) =>
    sharp("src/app/icon.png")
      .resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);

const ico = await pngToIco(buffers);
fs.writeFileSync("public/favicon.ico", ico);
console.log("Wrote public/favicon.ico (16/32/48 multi-size, true ICO format)");
