'use client'

import { useState, useRef } from 'react'
import { Logo } from '@/components/ui'
import { ChangeVideoModal } from '@/components/modals'
import { ChatPanel, UsersList, QueuePanel } from './panels'
import { SEED_MESSAGES, SEED_USERS, SEED_QUEUE, REACTION_EMOJIS } from '@/lib/constants'
import { formatTime } from '@/lib/helpers'

export function WatchRoom({ rcode, vid, nick, isHost, showToast, onLeave }) {
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [tab, setTab]                     = useState('chat')
  const [messages, setMessages]           = useState(SEED_MESSAGES)
  const [users, setUsers]                 = useState(SEED_USERS)
  const [queue, setQueue]                 = useState(SEED_QUEUE)
  const [currentVid, setCurrentVid]       = useState(vid)
  const [chatInput, setChatInput]         = useState('')
  const [floats, setFloats]               = useState([])
  const [showChangeVideo, setShowChangeVideo] = useState(false)
  const msgId = useRef(200)

  // ── Actions ──
  const sendMessage = () => {
    if (!chatInput.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: ++msgId.current, user: nick, msg: chatInput, t: formatTime(), host: isHost },
    ])
    setChatInput('')
  }

  const sendReaction = (emoji) => {
    const id    = Date.now()
    const left  = 30 + Math.random() * 40
    setFloats((prev) => [...prev, { id, emoji, left }])
    setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 1000)
  }

  const kickUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    showToast('User removed from room.', 'danger')
  }

  const muteUser = () => showToast('User chat muted.', 'warning')

  const changeVideo = (newVid) => {
    setCurrentVid(newVid)
    setQueue((prev) => prev.map((q) => ({ ...q, active: q.vid === newVid })))
    setShowChangeVideo(false)
    showToast('Video changed for all viewers.', 'success')
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(rcode).catch(() => {})
    showToast(`Code copied: ${rcode}`, 'info')
  }

  return (
    <div className="room-layout">
      {showChangeVideo && (
        <ChangeVideoModal onClose={() => setShowChangeVideo(false)} onSubmit={changeVideo} />
      )}

      {/* ── Room Nav ── */}
      <header className="room-nav">
        <div className="room-nav-left">
          <Logo size={14} />
          <span style={{ color: 'rgba(255,255,255,.2)' }}>·</span>
          <span className="room-nav-title">Watch Party</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="room-code-chip" onClick={copyCode}>{rcode}</button>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '4px 9px' }}
            onClick={onLeave}
          >
            Leave
          </button>
          {isHost && (
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => setShowChangeVideo(true)}
            >
              ↪ Change Video
            </button>
          )}
          <button
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕ Hide' : '☰ Chat'}
          </button>
        </div>
      </header>

      {/* ── Room Body ── */}
      <div className="room-body">

        {/* ── Video Column ── */}
        <div className="video-col">
          <div className="video-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${currentVid}?modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="StreamSync Video Player"
            />
            {/* Floating reactions */}
            {floats.map((f) => (
              <div
                key={f.id}
                className="float-emoji"
                style={{ left: `${f.left}%` }}
              >
                {f.emoji}
              </div>
            ))}
          </div>
          <div className="video-bar">
            <span style={{ fontSize: 11, color: '#8A90A0', fontWeight: 600 }}>
              {isHost ? '👑 Host — controls all viewers' : '🟢 Viewer'}
            </span>
            <div className="reactions">
              {REACTION_EMOJIS.map((em) => (
                <button key={em} className="react-btn" onClick={() => sendReaction(em)} title={`React ${em}`}>
                  {em}
                </button>
              ))}
            </div>
            <div className="sync-pill">
              <span className="sync-dot" />
              In Sync
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className={`sidebar${sidebarOpen ? '' : ' closed'}`}>
          <div className="sidebar-tabs">
            {[
              { id: 'chat',  label: '💬 Chat'          },
              { id: 'users', label: `👥 ${users.length}` },
              { id: 'queue', label: '📋 Queue'          },
            ].map((t) => (
              <button
                key={t.id}
                className={`sidebar-tab${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'chat' && (
            <ChatPanel
              messages={messages}
              nick={nick}
              input={chatInput}
              setInput={setChatInput}
              onSend={sendMessage}
            />
          )}
          {tab === 'users' && (
            <UsersList
              users={users}
              nick={nick}
              isHost={isHost}
              onKick={kickUser}
              onMute={muteUser}
            />
          )}
          {tab === 'queue' && (
            <QueuePanel
              queue={queue}
              isHost={isHost}
              onPlay={changeVideo}
              onAddVideo={() => setShowChangeVideo(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
