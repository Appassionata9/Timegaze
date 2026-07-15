import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const macosDirectory = path.dirname(new URL(import.meta.url).pathname);
const source = path.join(macosDirectory, "AppIconHighRes.png");
const assets = path.join(macosDirectory, "AppIconAssets");
const output = path.join(macosDirectory, "AppIcon.png");

await fs.rm(assets, { recursive: true, force: true });
await fs.mkdir(assets, { recursive: true });

const mask = Buffer.from(`
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="2" width="1004" height="1012" rx="214" fill="white"/>
  </svg>
`);
const master = await sharp(source)
  .resize(1024, 1024, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await fs.writeFile(output, master);

for (const size of [1024, 512, 256, 128, 64, 32]) {
  await sharp(master)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(assets, `Timegaze-${size}.png`));
}
