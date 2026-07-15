const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const windowsDirectory = __dirname;
const macosDirectory = path.join(windowsDirectory, "..", "macos");
const outputDirectory = path.join(windowsDirectory, "build");
const outputPath = path.join(outputDirectory, "icon.png");

const highResolutionPath = path.join(macosDirectory, "AppIconHighRes.png");
let source;
if (fs.existsSync(highResolutionPath)) {
  source = fs.readFileSync(highResolutionPath);
} else {
  const partNames = fs.readdirSync(macosDirectory)
    .filter(name => name.startsWith("AppIconHighRes.png.base64."))
    .sort();
  if (partNames.length === 0) {
    throw new Error("Missing AppIconHighRes.png and its base64 parts");
  }
  const encoded = partNames
    .map(name => fs.readFileSync(path.join(macosDirectory, name), "utf8"))
    .join("");
  source = Buffer.from(encoded, "base64");
}
const mask = Buffer.from(`
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="2" width="1004" height="1012" rx="214" fill="white"/>
  </svg>
`);

fs.mkdirSync(outputDirectory, { recursive: true });
sharp(source)
  .resize(1024, 1024, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toFile(outputPath)
  .then(() => console.log(outputPath));
