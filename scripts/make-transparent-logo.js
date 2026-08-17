const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const inputPath = 'C:\\Users\\nexus\\.gemini\\antigravity-ide\\brain\\f090322d-07b8-47b4-aaa7-c331a8054209\\.user_uploaded\\media_1786934919130.png';
  
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    return;
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Loop through pixels and make white/near-white background transparent
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if pixel is white/near-white background (RGB values close to 240-255)
    // Also handle subtle shadows near the white edge
    if (r > 215 && g > 215 && b > 215) {
      data[i + 3] = 0; // Set Alpha to transparent
    } else if (r > 190 && g > 190 && b > 190) {
      // Smooth feathering for anti-aliasing edges
      const alphaFactor = 1 - ((r + g + b) / 3 - 190) / (215 - 190);
      data[i + 3] = Math.max(0, Math.min(255, Math.floor(alphaFactor * 255)));
    }
  }

  const outputBuffer = await sharp(data, {
    raw: { width, height, channels }
  })
    .trim() // Crop extra transparent padding
    .png()
    .toBuffer();

  const dests = [
    'd:\\frankmotors\\public\\assets\\logo-babymotos.png',
    'd:\\frankmotors\\public\\assets\\logo-babymotos-transparent.png',
    'd:\\frankmotors\\public\\assets\\logo-3d.png',
    'd:\\frankmotors\\public\\assets\\logo-frankmotors.png',
  ];

  for (const dest of dests) {
    fs.writeFileSync(dest, outputBuffer);
    console.log('Saved transparent logo to:', dest);
  }
}

processLogo().catch(err => {
  console.error('Error processing logo:', err);
  process.exit(1);
});
