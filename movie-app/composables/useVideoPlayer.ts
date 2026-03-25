// ========== VIDEO PLAYER COMPOSABLE ==========
// Quản lý state video player: play/pause, mute, playback rate, progress

import { reactive } from 'vue'

export const useVideoPlayer = () => {
  // ========== REACTIVE STATE ==========
  const playerState = reactive({
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
    playbackRate: 1
  })

  // ========== TOGGLE PLAY/PAUSE ==========
  const togglePlay = () => {
    playerState.isPlaying = !playerState.isPlaying
  }

  // ========== TOGGLE MUTE ==========
  const toggleMute = () => {
    playerState.isMuted = !playerState.isMuted
  }

  // ========== SET PLAYBACK RATE ==========
  const setPlaybackRate = (rate: number) => {
    playerState.playbackRate = rate
  }

  // ========== HANDLE PROGRESS BAR CLICK ==========
  // Tính toán thời gian dựa vào vị trí click
  const handleProgressClick = (event: MouseEvent, duration: number) => {
    const target = event.currentTarget as HTMLDivElement
    if (target) {
      playerState.currentTime = Math.floor(
        (event.offsetX / target.offsetWidth) * duration
      )
    }
  }

  // ========== CALCULATE PROGRESS PERCENTAGE ==========
  const getProgressPercentage = (duration: number) => {
    return (playerState.currentTime / duration) * 100
  }

  // ========== FORMAT TIME HH:MM:SS ==========
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    playerState,
    togglePlay,
    toggleMute,
    setPlaybackRate,
    handleProgressClick,
    getProgressPercentage,
    formatTime
  }
}
