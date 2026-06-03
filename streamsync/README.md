# StreamSync

> Watch Together. Anywhere.

Real-time YouTube watch party platform. Create a room, share a code, watch in perfect sync — no account, no extensions, no friction.

---

## Stack

| Layer      | Tech                      |
|------------|---------------------------|
| Frontend   | Next.js 14 (App Router)   |
| Styling    | Global CSS + CSS variables |
| Real-Time  | WebSockets (FastAPI)       |
| Database   | SQLite → PostgreSQL        |
| Hosting    | Vercel                    |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── layout.jsx          ← Root layout, metadata, JSON-LD schemas
│   ├── page.jsx            ← Landing page
│   ├── globals.css         ← Full design system (CSS variables, components)
│   ├── sitemap.js          ← Auto-generated /sitemap.xml
│   ├── not-found.jsx       ← Custom 404
│   ├── error.jsx           ← Error boundary
│   ├── loading.jsx         ← Global loading state
│   ├── room/[code]/
│   │   ├── page.jsx        ← Suspense wrapper (server)
│   │   └── RoomClient.jsx  ← Client: reads URL params, renders WatchRoom
│   ├── seo/page.jsx        ← SEO + GEO + AIEO report
│   └── arch/page.jsx       ← Technical architecture overview
├── components/
│   ├── ui/                 ← Logo, Toast, FAQItem, GlobalNav
│   ├── landing/            ← Hero, Stats, Features, FAQ, Footer
│   ├── modals/             ← CreateRoomModal, JoinRoomModal, ChangeVideoModal
│   └── room/               ← WatchRoom, ChatPanel, UsersList, QueuePanel
├── hooks/
│   └── useToast.js
└── lib/
    ├── constants.js        ← Seed data, FAQs, features, stats, emojis
    └── helpers.js          ← genRoomCode, extractVideoId, getAvatarColor, formatTime
```

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Framework preset: **Next.js** (auto-detected)
5. Click **Deploy**

No environment variables needed for the frontend-only MVP.

---

## Room URL Format

```
/room/[CODE]?vid=[YOUTUBE_VIDEO_ID]&nick=[NICKNAME]&host=true
```

| Param  | Description                             |
|--------|-----------------------------------------|
| `vid`  | YouTube video ID (e.g. `dQw4w9WgXcQ`)  |
| `nick` | Viewer's display name                   |
| `host` | `true` if the user created the room     |

---

## Features (MVP)

- ✅ Create room with YouTube URL → shareable room code
- ✅ Join room with code + nickname
- ✅ YouTube video embed
- ✅ Real-time chat with nicknames + timestamps
- ✅ User presence list with status indicators
- ✅ Emoji reactions with floating animations
- ✅ Video queue with thumbnails
- ✅ Host controls: change video, kick, mute
- ✅ Mobile-responsive layout
- ✅ SEO: JSON-LD schemas, metadata API, robots.txt, sitemap
- ✅ GEO/AIEO: entity-rich FAQ, answer-first copy, structured featureList

## V1 Roadmap

- [ ] Real WebSocket backend (FastAPI)
- [ ] Actual playback sync via YouTube IFrame API
- [ ] Google / Discord OAuth
- [ ] Public room browser
- [ ] Voice chat
- [ ] Persistent room history

---

## Design System

| Token          | Value     |
|----------------|-----------|
| Background     | `#0F1115` |
| Surface        | `#171A21` |
| Card           | `#20242D` |
| Accent         | `#5865F2` |
| Success        | `#22C55E` |
| Danger         | `#EF4444` |
| Font (display) | Syne 700/800 |
| Font (body)    | DM Sans 400–700 |

---

Made with ❤️ · StreamSync MVP v1.0
