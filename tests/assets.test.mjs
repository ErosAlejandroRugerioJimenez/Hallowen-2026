import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
function sources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = join(directory, entry.name)
    return entry.isDirectory() ? sources(file) : [file]
  })
}
test('cada imagen y fuente referenciada por el código existe en public', () => {
  let checked = 0
  for (const file of [...sources(join(root, 'src')), join(root, 'index.html')]) {
    for (const match of readFileSync(file, 'utf8').matchAll(/['"(](\/(?:images|fonts)\/[^'")\s]+)/g)) {
      assert.ok(existsSync(resolve(root, 'public', '.' + match[1])), file + ': falta ' + match[1])
      checked++
    }
  }
  assert.ok(checked > 0)
})
