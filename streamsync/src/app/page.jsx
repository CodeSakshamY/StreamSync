'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalNav } from '@/components/ui/GlobalNav'
import { Hero, Stats, Features, FAQ, Footer } from '@/components/landing'
import { CreateRoomModal, JoinRoomModal } from '@/components/modals'
import { Toast } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { genRoomCode } from '@/lib/helpers'

export default function HomePage() {
  const router           = useRouter()
  const { toast, showToast } = useToast()
  const [modal, setModal] = useState(null) // null | 'create' | 'join'

  const handleCreate = (vid) => {
    const code = genRoomCode()
    router.push(`/room/${code}?vid=${vid}&nick=Host&host=true`)
  }

  const handleJoin = (code, nick) => {
    router.push(`/room/${code}?nick=${encodeURIComponent(nick)}`)
  }

  const navRight = (
    <>
      <button
        className="btn btn-secondary"
        style={{ padding: '7px 14px', fontSize: 13 }}
        onClick={() => setModal('join')}
      >
        Join Room
      </button>
      <button
        className="btn btn-primary"
        style={{ padding: '7px 14px', fontSize: 13 }}
        onClick={() => setModal('create')}
      >
        Create Room
      </button>
    </>
  )

  return (
    <>
      {toast && <Toast msg={toast.msg} kind={toast.kind} />}

      <GlobalNav rightSlot={navRight} />

      <main>
        <Hero
          onCreate={() => setModal('create')}
          onJoin={() => setModal('join')}
        />
        <Stats />
        <Features />
        <FAQ />
      </main>

      <Footer />

      {modal === 'create' && (
        <CreateRoomModal onClose={() => setModal(null)} onSubmit={handleCreate} />
      )}
      {modal === 'join' && (
        <JoinRoomModal onClose={() => setModal(null)} onSubmit={handleJoin} />
      )}
    </>
  )
}
