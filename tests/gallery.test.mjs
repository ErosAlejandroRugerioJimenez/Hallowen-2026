import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, stat, writeFile, readdir, unlink, rmdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import importer from '../scripts/import-gallery.cjs'

async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'hallowen-gallery-test-'))
  t.after(async () => {
    async function clean(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = join(dir, entry.name)
        if (entry.isDirectory()) await clean(file)
        else await unlink(file)
      }
      await rmdir(dir)
    }
    await clean(root)
  })
  return root
}
test('sin fotos genera una galería vacía válida', async t => {
  const root = await workspace(t)
  assert.deepEqual(await importer.importGallery(root), [])
  assert.match(await readFile(join(root, 'src/data/memories.ts'), 'utf8'), /memories: MemoryPhoto\[\] = \[\]/)
})
test('convierte fotos, conserva originales, detecta año y reutiliza WebP sin recomprimir', async t => {
  const root = await workspace(t)
  const input = join(root, 'fotos-recuerdos/2024')
  await mkdir(input, { recursive: true })
  const original = join(input, '01-desfile.png')
  await sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#a67d32' } }).png().toFile(original)
  const before = await readFile(original)
  const [photo] = await importer.importGallery(root)
  assert.equal(photo.year, '2024')
  assert.equal(photo.width, 1600)
  assert.equal(photo.smallWidth, 640)
  assert.equal(photo.height, 800)
  assert.deepEqual(await readFile(original), before)
  const output = join(root, 'public', photo.src)
  assert.equal((await sharp(await readFile(output)).metadata()).format, 'webp')
  const modified = (await stat(output)).mtimeMs
  await importer.importGallery(root)
  assert.equal((await stat(output)).mtimeMs, modified)
})
test('un archivo dañado no reemplaza el índice anterior', async t => {
  const root = await workspace(t)
  await importer.importGallery(root)
  const manifest = join(root, 'src/data/memories.ts')
  const previous = await readFile(manifest, 'utf8')
  await writeFile(join(root, 'fotos-recuerdos/rota.jpg'), 'no es una imagen')
  await assert.rejects(importer.importGallery(root))
  assert.equal(await readFile(manifest, 'utf8'), previous)
})

test('la selección controla orden y descripción sin confundir la fecha de WhatsApp', async t => {
  const root = await workspace(t)
  const input = join(root, 'fotos-recuerdos')
  await mkdir(input, { recursive: true })
  const name = 'WhatsApp Image 2026-10-14.jpeg'
  await sharp({ create: { width: 80, height: 120, channels: 3, background: '#333' } }).jpeg().toFile(join(input, name))
  const automatic = await importer.importGallery(root)
  assert.equal(automatic[0].year, null)
  await writeFile(join(input, 'seleccion.json'), JSON.stringify([{ file: name, alt: 'Vecinos en el desfile.', year: null }]))
  const selected = await importer.importGallery(root)
  assert.equal(selected.length, 1)
  assert.equal(selected[0].alt, 'Vecinos en el desfile.')
  assert.equal(selected[0].year, null)
})
test('rechaza rutas de selección fuera de la carpeta de originales', async t => {
  const root = await workspace(t)
  await importer.importGallery(root)
  await writeFile(join(root, 'fotos-recuerdos/seleccion.json'), JSON.stringify([{ file: '../ajena.jpg' }]))
  await assert.rejects(importer.importGallery(root), /Ruta de foto inválida/)
})
