import { ROOM_WORDS, AVATAR_COLORS } from './constants'

export function genRoomCode() {
  const word = ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)]
  const num  = Math.floor(Math.random() * 9) + 1
  return `${word}${num}`
}

export function extractVideoId(url) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function getStatusIcon(status) {
  switch (status) {
    case 'active':       return '🟢'
    case 'reconnecting': return '🟡'
    case 'disconnected': return '🔴'
    default:             return '🟢'
  }
}
