import sharp from "sharp";

const SRC = "assets/appicon.png";
const BG_COLOR = { r: 254, g: 226, b: 226, alpha: 1 }; // #FEE2E2

async function main() {
  // 1. icon.png — 1024x1024, Nouri on warm white background
  await sharp(SRC)
    .resize(1024, 1024, { fit: "contain", background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .flatten({ background: { r: 255, g: 248, b: 240 } })
    .png()
    .toFile("assets/icon.png");
  console.log("✓ icon.png (1024x1024)");

  // 2. adaptive-icon.png — 1024x1024, same as icon
  await sharp(SRC)
    .resize(1024, 1024, { fit: "contain", background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .flatten({ background: { r: 255, g: 248, b: 240 } })
    .png()
    .toFile("assets/adaptive-icon.png");
  console.log("✓ adaptive-icon.png (1024x1024)");

  // 3. android-icon-foreground.png — Nouri centered with ~30% padding, transparent bg
  // 30% padding means the image takes 70% of 1024 = ~716px, centered
  const fgSize = 716;
  const fgPad = Math.round((1024 - fgSize) / 2);
  const resizedNouri = await sharp(SRC)
    .resize(fgSize, fgSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resizedNouri, left: fgPad, top: fgPad }])
    .png()
    .toFile("assets/android-icon-foreground.png");
  console.log("✓ android-icon-foreground.png (1024x1024, 30% padding)");

  // 4. android-icon-background.png — solid #FEE2E2, no transparency
  await sharp({
    create: { width: 1024, height: 1024, channels: 3, background: BG_COLOR },
  })
    .png()
    .toFile("assets/android-icon-background.png");
  console.log("✓ android-icon-background.png (1024x1024, solid #FEE2E2)");

  // 5. android-icon-monochrome.png — grayscale silhouette
  await sharp(SRC)
    .resize(716, 716, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .grayscale()
    .png()
    .toBuffer()
    .then(async (grayscaleBuf) => {
      await sharp({
        create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
      })
        .composite([{ input: grayscaleBuf, left: fgPad, top: fgPad }])
        .png()
        .toFile("assets/android-icon-monochrome.png");
    });
  console.log("✓ android-icon-monochrome.png (1024x1024, grayscale)");

  // 6. favicon.png — 48x48
  await sharp(SRC)
    .resize(48, 48, { fit: "contain", background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .flatten({ background: { r: 255, g: 248, b: 240 } })
    .png()
    .toFile("assets/favicon.png");
  console.log("✓ favicon.png (48x48)");

  // 7. splash-icon.png — 1024x1024
  await sharp(SRC)
    .resize(1024, 1024, { fit: "contain", background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .flatten({ background: { r: 255, g: 248, b: 240 } })
    .png()
    .toFile("assets/splash-icon.png");
  console.log("✓ splash-icon.png (1024x1024)");

  console.log("\nAll icons generated successfully!");
}

main().catch(console.error);
