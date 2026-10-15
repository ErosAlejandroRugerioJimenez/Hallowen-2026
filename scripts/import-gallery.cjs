const fs = require('node:fs/promises')
const path = require('node:path')
const { createHash } = require('node:crypto')
const sharp = require('sharp')

const formats = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])
async function findPhotos(directory) {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await findPhotos(file))
    else if (entry.isFile() && formats.has(path.extname(entry.name).toLowerCase())) files.push(file)
  }
  return files.sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
}

async function importGallery(root = path.resolve(__dirname, '..')) {
  const input = path.join(root, 'fotos-recuerdos')
  const output = path.join(root, 'public/images/recuerdos')
  await fs.mkdir(input, { recursive: true })
  await fs.mkdir(output, { recursive: true })
  let selection
  try { selection = JSON.parse(await fs.readFile(path.join(input, 'seleccion.json'), 'utf8')) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (selection !== undefined && !Array.isArray(selection)) throw new Error('seleccion.json debe contener una lista')
  const entries = selection === undefined
    ? (await findPhotos(input)).map(file => ({ file }))
    : selection.map(item => {
      if (!item || typeof item.file !== 'string') throw new Error('Foto inválida')
      const file = path.resolve(input, item.file)
      const relative = path.relative(input, file)
      if (relative.startsWith('..') || path.isAbsolute(relative) || !formats.has(path.extname(file).toLowerCase())) throw new Error('Ruta de foto inválida')
      if (item.year != null && !/^(19|20)\d{2}$/.test(String(item.year))) throw new Error('Año inválido')
      return { ...item, file }
    })
  const photos = []
  for (const entry of entries) {
    const file = entry.file
    const buffer = await fs.readFile(file)
    const hash = createHash('sha256').update(buffer).update('webp-v1').digest('hex').slice(0, 20)
    const largeName = hash + '-1600.webp'
    const smallName = hash + '-640.webp'
    const largePath = path.join(output, largeName)
    const smallPath = path.join(output, smallName)
    for (const [target, width] of [[largePath, 1600], [smallPath, 640]]) {
      try { await fs.access(target) } catch {
        await sharp(buffer).rotate().resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 }).toFile(target)
      }
    }
    const { width, height } = await sharp(await fs.readFile(largePath)).metadata()
    const { width: smallWidth } = await sharp(await fs.readFile(smallPath)).metadata()
    const relative = path.relative(input, file)
    // WhatsApp filenames indicate the transfer date, not the event year.
    const yearSource = /^WhatsApp/i.test(path.basename(file)) ? path.dirname(relative) : relative
    const inferredYear = yearSource.match(/(?:^|[^\d])((?:19|20)\d{2})(?!\d)/)?.[1] ?? null
    const year = Object.hasOwn(entry, 'year') ? (entry.year == null ? null : String(entry.year)) : inferredYear
    photos.push({
      src: '/images/recuerdos/' + largeName,
      smallSrc: '/images/recuerdos/' + smallName,
      width, height, smallWidth,
      alt: typeof entry.alt === 'string' && entry.alt.trim() ? entry.alt.trim() : 'Recuerdo de La Calle de las Brujas' + (year ? ', edición ' + year : '') + ', fotografía ' + (photos.length + 1),
      year,
    })
  }
  const declaration = 'export interface MemoryPhoto {\n  src: string\n  smallSrc: string\n  width: number\n  smallWidth: number\n  height: number\n  alt: string\n  year: string | null\n}\n'
  const content = declaration + 'export const memories: MemoryPhoto[] = ' + JSON.stringify(photos, null, 2) + '\n'
  const manifest = path.join(root, 'src/data/memories.ts')
  await fs.mkdir(path.dirname(manifest), { recursive: true })
  const previous = await fs.readFile(manifest, 'utf8').catch(() => '')
  if (previous !== content) {
    await fs.writeFile(manifest + '.tmp', content)
    await fs.rename(manifest + '.tmp', manifest)
  }
  console.log(photos.length + ' fotos preparadas para el carrusel.')
  return photos
}
module.exports = { importGallery }
if (require.main === module) importGallery().catch(error => {
  console.error('No se pudo importar la galería. Revisa las fotos: ' + error.message)
  process.exitCode = 1
})

