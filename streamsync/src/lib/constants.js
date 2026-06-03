export const ROOM_WORDS = [
  'RIVER','OCEAN','FALCON','COSMOS','EMBER',
  'TITAN','NOVA','PRISM','BLAZE','NEXUS',
]

export const AVATAR_COLORS = [
  '#5865F2','#22C55E','#F59E0B','#EF4444',
  '#8B5CF6','#EC4899','#14B8A6','#F97316',
]

export const REACTION_EMOJIS = ['😂','❤️','🔥','😮','👏','😭','🎉','💀']

export const SEED_MESSAGES = [
  { id: 1, user: 'Emma',  msg: 'omg this part!! 😭',                t: '2:31 PM', host: false },
  { id: 2, user: 'Alex',  msg: 'told you it gets good 😌',           t: '2:31 PM', host: true  },
  { id: 3, user: 'John',  msg: 'WAIT WHAT',                          t: '2:32 PM', host: false },
  { id: 4, user: 'Sarah', msg: 'rewind 20 secs please!!',            t: '2:32 PM', host: false },
  { id: 5, user: 'Mike',  msg: "seen it 3× still hits different 🔥", t: '2:33 PM', host: false },
]

export const SEED_USERS = [
  { id: 1, name: 'Alex',  host: true,  status: 'active'       },
  { id: 2, name: 'Emma',  host: false, status: 'active'       },
  { id: 3, name: 'John',  host: false, status: 'active'       },
  { id: 4, name: 'Sarah', host: false, status: 'reconnecting' },
  { id: 5, name: 'Mike',  host: false, status: 'active'       },
]

export const SEED_QUEUE = [
  { id: 1, vid: 'dQw4w9WgXcQ', title: 'Rick Astley — Never Gonna Give You Up', active: true  },
  { id: 2, vid: '9bZkp7q19f0', title: 'PSY — Gangnam Style',                   active: false },
  { id: 3, vid: 'JGwWNGJdvx8', title: 'Ed Sheeran — Shape Of You',             active: false },
]

export const FAQ_DATA = [
  {
    q: 'What is StreamSync?',
    a: 'StreamSync is a free real-time watch party platform that synchronises YouTube videos for groups. Create a room, share a 6-character code, and watch together — no account needed.',
  },
  {
    q: 'Do I need an account?',
    a: 'No account, no sign-up, no downloads. Enter a YouTube URL, get a room code, share with friends, and start watching in under 10 seconds.',
  },
  {
    q: 'How many people can join?',
    a: 'Up to 50 people can watch simultaneously in one room. V1 expands this to 500 viewers per room.',
  },
  {
    q: 'How does sync work?',
    a: 'Play, pause, and seek events broadcast via WebSocket instantly. An auto-correction system runs every 5 seconds and resyncs anyone drifting more than 2 seconds.',
  },
  {
    q: 'What if the host leaves?',
    a: 'The room stays active for 10–15 minutes. If the host returns, privileges restore. If not, the oldest remaining participant becomes host automatically.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. StreamSync is mobile-first — iOS, Android, and all modern mobile browsers. Chat becomes a swipeable bottom drawer so video always stays front and centre.',
  },
]

export const FEATURES = [
  { icon: '⚡', title: 'Zero Setup',    desc: 'Room in under 10 seconds. No account, no extensions, no friction of any kind.' },
  { icon: '🔄', title: 'Perfect Sync',  desc: 'WebSocket broadcast for play/pause/seek. Drift auto-corrects every 5 seconds.' },
  { icon: '💬', title: 'Live Chat',     desc: 'Real-time chat with nicknames, timestamps, and host badges.' },
  { icon: '👑', title: 'Host Controls', desc: 'Change video, kick users, mute chat, delete messages.' },
  { icon: '📱', title: 'Mobile First',  desc: 'iOS, Android, all modern mobile browsers. Swipeable chat drawer.' },
  { icon: '🎬', title: 'Video Queue',   desc: 'Queue videos ahead of time. Auto-play next. Reorder on the fly.' },
]

export const STATS = [
  { value: '<10s', label: 'Room Created' },
  { value: '<2s',  label: 'To Join'      },
  { value: '50',   label: 'Viewers/Room' },
  { value: '<2s',  label: 'Max Drift'    },
]
