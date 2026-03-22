import sharp from "sharp";

async function run() {
  await sharp("assets/logo.svg")
    .resize(512, 512)
    .png({ compressionLevel: 6 })
    .toFile("assets/logo-512.png");

  await sharp("assets/logo.svg")
    .resize(256, 256)
    .png({ compressionLevel: 6 })
    .toFile("assets/logo-256.png");

  await sharp("assets/brand-banner.svg")
    .resize(1600, 800)
    .png({ compressionLevel: 6 })
    .toFile("assets/brand-banner-1600x800.png");
}

run().catch((err) => {
  console.error("Failed to export logos", err);
  process.exit(1);
});
