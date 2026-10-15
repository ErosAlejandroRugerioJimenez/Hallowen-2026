/**
 * Ambiente sintetizado con Web Audio: viento, murmullos sin palabras,
 * campanas y un tono grave. Intenta comenzar al entrar y se reanuda con un gesto si el navegador lo exige.
 */
export class AmbientAudio {
  private context: AudioContext
  private master: GainNode
  private bellTimer: ReturnType<typeof setTimeout> | null = null
  private active = false
  private disposed = false
  private volume = 0.18

  constructor(private onPlayingChange: (playing: boolean) => void = () => {}) {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) throw new Error('Web Audio no disponible')
    this.context = new AudioContextClass()
    this.context.onstatechange = () => {
      if (!this.disposed) this.onPlayingChange(this.isPlaying)
    }
    this.master = this.context.createGain()
    this.master.gain.value = 0
    const compressor = this.context.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.ratio.value = 4
    this.master.connect(compressor)
    compressor.connect(this.context.destination)
    this.createWind()
    this.createMurmurs()
    this.createDrone()
  }

  private noise(seconds: number): AudioBuffer {
    const buffer = this.context.createBuffer(1, this.context.sampleRate * seconds, this.context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  private createWind() {
    const source = this.context.createBufferSource()
    source.buffer = this.noise(8)
    source.loop = true
    const lowpass = this.context.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 450
    const highpass = this.context.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 65
    const gain = this.context.createGain()
    gain.gain.value = 0.33
    const swell = this.context.createOscillator()
    swell.frequency.value = 0.07
    const depth = this.context.createGain()
    depth.gain.value = 0.1
    swell.connect(depth).connect(gain.gain)
    source.connect(highpass).connect(lowpass).connect(gain).connect(this.master)
    source.start()
    swell.start()
  }

  private createMurmurs() {
    const source = this.context.createBufferSource()
    source.buffer = this.noise(11)
    source.loop = true
    const filter = this.context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1050
    filter.Q.value = 2.5
    const gain = this.context.createGain()
    gain.gain.value = 0.065
    const breath = this.context.createOscillator()
    breath.frequency.value = 0.13
    const depth = this.context.createGain()
    depth.gain.value = 0.04
    breath.connect(depth).connect(gain.gain)
    source.connect(filter).connect(gain).connect(this.master)
    source.start()
    breath.start()
  }

  private createDrone() {
    for (const frequency of [110, 110.35, 220]) {
      const oscillator = this.context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const gain = this.context.createGain()
      gain.gain.value = 0.045
      oscillator.connect(gain).connect(this.master)
      oscillator.start()
    }
  }

  private ringBell() {
    if (!this.active || this.disposed || this.context.state !== 'running') return
    const now = this.context.currentTime
    for (const [index, frequency] of [174.61, 350.4, 476.2, 703.3].entries()) {
      const oscillator = this.context.createOscillator()
      oscillator.frequency.value = frequency
      const gain = this.context.createGain()
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.13 / (index + 1), now + 0.045)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.5)
      oscillator.connect(gain).connect(this.master)
      oscillator.start(now)
      oscillator.stop(now + 7)
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
    }
  }

  private scheduleBell(delay = 250) {
    if (this.bellTimer !== null) clearTimeout(this.bellTimer)
    this.bellTimer = setTimeout(() => {
      this.bellTimer = null
      if (!this.active || this.disposed) return
      this.ringBell()
      this.scheduleBell(13000 + Math.random() * 7000)
    }, delay)
  }

  get isPlaying() {
    return !this.disposed && this.active && this.context.state === 'running'
  }

  async play() {
    if (this.disposed || this.isPlaying) return
    this.active = true
    await this.context.resume()
    if (this.disposed) return
    // A delayed autoplay resume must never undo the visitor's mute action.
    if (!this.active) {
      await this.context.suspend()
      return
    }
    this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.35)
    this.onPlayingChange(this.isPlaying)
    this.scheduleBell()
  }

  async pause() {
    this.active = false
    this.onPlayingChange(false)
    if (this.bellTimer !== null) clearTimeout(this.bellTimer)
    this.bellTimer = null
    if (!this.disposed && this.context.state !== 'closed') {
      this.master.gain.cancelScheduledValues(this.context.currentTime)
      this.master.gain.setValueAtTime(0, this.context.currentTime)
      await this.context.suspend()
    }
  }
  dispose() {
    this.disposed = true
    this.active = false
    if (this.bellTimer !== null) clearTimeout(this.bellTimer)
    this.bellTimer = null
    void this.context.close().catch(() => undefined)
  }
}
