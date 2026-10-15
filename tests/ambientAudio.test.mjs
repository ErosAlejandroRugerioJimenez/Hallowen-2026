import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const source = readFileSync(new URL('../src/lib/ambientAudio.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { AmbientAudio } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
class Param {
  value = 0
  setTargetAtTime() {}
  cancelScheduledValues() {}
  setValueAtTime() {}
  linearRampToValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class AudioNode {
  gain = new Param()
  frequency = new Param()
  Q = new Param()
  threshold = new Param()
  ratio = new Param()
  connect(node) { return node }
  start() {}
  stop() {}
  disconnect() {}
}
class FakeContext {
  static blocked = false
  static last
  state = 'suspended'
  currentTime = 0
  sampleRate = 10
  destination = new AudioNode()
  pending = []
  constructor() { FakeContext.last = this }
  createGain() { return new AudioNode() }
  createDynamicsCompressor() { return new AudioNode() }
  createBufferSource() { return new AudioNode() }
  createBiquadFilter() { return new AudioNode() }
  createOscillator() { return new AudioNode() }
  createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) } }
  resume() {
    if (FakeContext.blocked) return new Promise(resolve => this.pending.push(resolve))
    this.state = 'running'; this.onstatechange?.(); return Promise.resolve()
  }
  unlock() { this.state = 'running'; this.onstatechange?.(); this.pending.splice(0).forEach(resolve => resolve()) }
  suspend() { this.state = 'suspended'; this.onstatechange?.(); return Promise.resolve() }
  close() { this.state = 'closed'; return Promise.resolve() }
}
globalThis.window = { AudioContext: FakeContext }
test('el control solo indica reproducción con el contexto activo y se apaga al pausar', async () => {
  FakeContext.blocked = false
  const changes = []
  const audio = new AmbientAudio(value => changes.push(value))
  assert.equal(audio.isPlaying, false)
  await audio.play()
  assert.equal(audio.isPlaying, true)
  await audio.pause()
  assert.equal(audio.isPlaying, false)
  assert.equal(changes.at(-1), false)
  audio.dispose()
})
test('un autoplay pendiente no vuelve a encender el sonido después de apagarlo', async () => {
  FakeContext.blocked = true
  const audio = new AmbientAudio()
  const pending = audio.play()
  assert.equal(audio.isPlaying, false)
  await audio.pause()
  FakeContext.last.unlock()
  await pending
  assert.equal(audio.isPlaying, false)
  assert.equal(FakeContext.last.state, 'suspended')
  audio.dispose()
})
test('se puede reintentar al tocar sin esperar a que termine el autoplay bloqueado', async () => {
  FakeContext.blocked = true
  const audio = new AmbientAudio()
  const pending = audio.play()
  FakeContext.blocked = false
  await audio.play()
  assert.equal(audio.isPlaying, true)
  FakeContext.last.unlock()
  await pending
  audio.dispose()
})
