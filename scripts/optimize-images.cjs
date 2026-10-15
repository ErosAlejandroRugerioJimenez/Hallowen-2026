const sharp = require('sharp')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const original = name => path.join(root, 'assets/generated', name + '.png')
const output = name => path.join(root, 'public/images', name)
async function main() {
  await sharp(original('catrina-night')).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 83 }).toFile(output('catrina-night.webp'))
  await sharp(original('catrina-foreground')).resize({ height: 1200, withoutEnlargement: true }).webp({ quality: 83 }).toFile(output('catrina-foreground.webp'))
  await sharp(original('street-background')).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output('street-background.webp'))
  await sharp(original('cartel-concursos-2026')).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 85 }).toFile(output('cartel-concursos-2026.webp'))
  await sharp(original('cartel-concursos-2026')).jpeg({ quality: 93, mozjpeg: true }).toFile(output('cartel-concursos-2026.jpg'))
  await sharp(original('catrina-foreground')).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output('catrina-foreground-mobile.webp'))
  await sharp(original('street-background')).resize({ width: 768, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output('street-background-mobile.webp'))
  console.log('7 imágenes actuales optimizadas, incluidas las variantes móviles.')
}
main().catch(error => { console.error(error); process.exitCode = 1 })

