const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const noBgFolder = "no-bg";
const distFolder = "dist";

if (fs.existsSync(distFolder)) {
  fs.rmdirSync(distFolder, { recursive: true });
}
fs.mkdirSync(distFolder);

fs.readdir(noBgFolder, (err, files) => {
  if (err) {
    console.error("Error reading the no-bg folder:", err);
    return;
  }

  files.forEach((file) => {
    const inputPath = path.join(noBgFolder, file);

    const outputPath = path.join(
      distFolder,
      path.basename(file, path.extname(file)) + ".png"
    );

    sharp(inputPath)
      .raw()
      .ensureAlpha()
      .toBuffer((err, data, { width, height }) => {
        if (err) throw err;

        let left = width,
          right = 0,
          top = height,
          bottom = 0;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[4 * (y * width + x) + 3]; // Get alpha value

            if (alpha > 0) {
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
            }
          }
        }

        if (left < right && top < bottom) {
          sharp(inputPath)
            .extract({
              width: right - left + 1,
              height: bottom - top + 1,
              left,
              top,
            })
            .png()
            .toFile(outputPath, (err) => {
              if (err) throw err;
              console.log(`Cropped and saved as PNG: ${outputPath}`);
            });
        } else {
          console.log(`No content to crop in ${inputPath}`);
        }
      });
  });
});
