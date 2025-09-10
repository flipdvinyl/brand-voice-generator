// 전화기 음질 EQ 필터 유틸리티

// Web Audio API 타입 선언
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class PhoneEQProcessor {
  private audioContext: AudioContext | null = null
  private source: MediaElementAudioSourceNode | null = null
  private gainNode: GainNode | null = null
  private lowPassFilter: BiquadFilterNode | null = null
  private highPassFilter: BiquadFilterNode | null = null
  private bandPassFilter: BiquadFilterNode | null = null
  private outputGain: GainNode | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error('AudioContext 초기화 실패:', error)
    }
  }

  // 전화기 EQ 필터 체인 생성
  private createPhoneEQChain(audioElement: HTMLAudioElement): MediaElementAudioSourceNode | null {
    if (!this.audioContext) {
      console.error('AudioContext가 초기화되지 않음')
      return null
    }

    try {
      // 오디오 소스 생성
      this.source = this.audioContext.createMediaElementSource(audioElement)
      
      // 게인 노드 (볼륨 조절) - 1.5배 더 극적으로
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = 1.3 // 볼륨 증폭
      
      // 저역 통과 필터 (고주파 제거 - 전화기 특성) - 1.5배 더 극적으로
      this.lowPassFilter = this.audioContext.createBiquadFilter()
      this.lowPassFilter.type = 'lowpass'
      this.lowPassFilter.frequency.value = 2500 // 더 낮은 상한 주파수 (3400 → 2500)
      this.lowPassFilter.Q.value = 0.8 // 더 강한 필터링 (0.5 → 0.8)
      
      // 고역 통과 필터 (저주파 제거) - 1.5배 더 극적으로
      this.highPassFilter = this.audioContext.createBiquadFilter()
      this.highPassFilter.type = 'highpass'
      this.highPassFilter.frequency.value = 500 // 더 높은 하한 주파수 (300 → 500)
      this.highPassFilter.Q.value = 0.8 // 더 강한 필터링 (0.5 → 0.8)
      
      // 대역 통과 필터 (중간 주파수 강조) - 1.5배 더 극적으로
      this.bandPassFilter = this.audioContext.createBiquadFilter()
      this.bandPassFilter.type = 'bandpass'
      this.bandPassFilter.frequency.value = 1200 // 약간 높은 중간 주파수 (1000 → 1200)
      this.bandPassFilter.Q.value = 1.5 // 더 강한 대역 필터링 (1.0 → 1.5)
      this.bandPassFilter.gain.value = 3.0 // 더 강한 중간 주파수 강조 (2.0 → 3.0)
      
      // 출력 게인 노드
      this.outputGain = this.audioContext.createGain()
      this.outputGain.gain.value = 1.0
      
      // 필터 체인 연결
      this.source
        .connect(this.gainNode)
        .connect(this.highPassFilter)
        .connect(this.lowPassFilter)
        .connect(this.bandPassFilter)
        .connect(this.outputGain)
        .connect(this.audioContext.destination)
      
      console.log('📞 전화기 EQ 필터 체인 생성 완료')
      return this.source
      
    } catch (error) {
      console.error('전화기 EQ 필터 체인 생성 실패:', error)
      return null
    }
  }

  // 전화기 EQ 적용
  applyPhoneEQ(audioElement: HTMLAudioElement): boolean {
    if (!audioElement) {
      console.error('오디오 엘리먼트가 없음')
      return false
    }

    // AudioContext가 suspended 상태면 resume
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }

    // 기존 연결 해제
    this.disconnect()
    
    // 전화기 EQ 체인 생성
    const source = this.createPhoneEQChain(audioElement)
    
    if (source) {
      console.log('📞 전화기 EQ 필터 적용 완료')
      return true
    }
    
    return false
  }

  // EQ 필터 해제
  disconnect() {
    try {
      if (this.source) {
        this.source.disconnect()
        this.source = null
      }
      if (this.gainNode) {
        this.gainNode.disconnect()
        this.gainNode = null
      }
      if (this.lowPassFilter) {
        this.lowPassFilter.disconnect()
        this.lowPassFilter = null
      }
      if (this.highPassFilter) {
        this.highPassFilter.disconnect()
        this.highPassFilter = null
      }
      if (this.bandPassFilter) {
        this.bandPassFilter.disconnect()
        this.bandPassFilter = null
      }
      if (this.outputGain) {
        this.outputGain.disconnect()
        this.outputGain = null
      }
      console.log('📞 전화기 EQ 필터 해제 완료')
    } catch (error) {
      console.error('전화기 EQ 필터 해제 실패:', error)
    }
  }

  // AudioContext 정리
  cleanup() {
    this.disconnect()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// 전역 인스턴스
let phoneEQProcessor: PhoneEQProcessor | null = null

// 전화기 EQ 적용 함수
export const applyPhoneEQ = (audioElement: HTMLAudioElement): boolean => {
  if (!phoneEQProcessor) {
    phoneEQProcessor = new PhoneEQProcessor()
  }
  return phoneEQProcessor.applyPhoneEQ(audioElement)
}

// 전화기 EQ 해제 함수
export const removePhoneEQ = (): void => {
  if (phoneEQProcessor) {
    phoneEQProcessor.disconnect()
  }
}

// 전화기 EQ 정리 함수
export const cleanupPhoneEQ = (): void => {
  if (phoneEQProcessor) {
    phoneEQProcessor.cleanup()
    phoneEQProcessor = null
  }
}
