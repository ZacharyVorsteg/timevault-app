const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  const svg = fs.readFileSync(svgPath);

  const sizes = [
    { name: 'favicon.ico', size: 32 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);

    if (name.endsWith('.ico')) {
      // For favicon, create a PNG first then we'll rename (browsers accept PNG favicons)
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(outputPath.replace('.ico', '.png'));

      // Copy as favicon.ico (most browsers handle PNG favicons)
      fs.copyFileSync(outputPath.replace('.ico', '.png'), outputPath);
      console.log(`Generated: ${name} (${size}x${size})`);
    } else {
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated: ${name} (${size}x${size})`);
    }
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
