// Simple sound effect manager using Web Audio API
class SoundManager {
    constructor() {
        this.sounds = {}
        this.enabled = true
        this.audioContext = null
    }

    // Initialize audio context (needs user interaction)
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }
    }

    // Play a simple beep sound with specific frequency and duration
    playBeep(frequency = 440, duration = 0.1, type = 'sine') {
        if (!this.enabled) return

        this.init()

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + duration)
    }

    // Task completion sound
    completeTask() {
        this.playBeep(523, 0.1, 'square') // C5 note
        setTimeout(() => this.playBeep(659, 0.15, 'square'), 100) // E5 note
    }

    // Level up sound
    levelUp() {
        this.playBeep(523, 0.1, 'sine') // C5
        setTimeout(() => this.playBeep(659, 0.1, 'sine'), 100) // E5
        setTimeout(() => this.playBeep(784, 0.2, 'sine'), 200) // G5
    }

    // Buy item sound
    buyItem() {
        this.playBeep(880, 0.08, 'triangle') // A5
        setTimeout(() => this.playBeep(1047, 0.12, 'triangle'), 80) // C6
    }

    // Error sound
    error() {
        this.playBeep(200, 0.2, 'sawtooth')
    }

    toggle() {
        this.enabled = !this.enabled
        return this.enabled
    }
}

// Export singleton instance
export const soundManager = new SoundManager()
