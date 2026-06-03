'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { WatchRoom } from '@/components/room/WatchRoom'
import { Toast } from '@/components/ui'
import { useToast } from '@/hooks/useToast'

export default function RoomClient({ code }) {
  const searchParams     = useSearchParams()
  const router           = useRouter()
  const { toast, showToast } = useToast()

  const rcode  = code.toUpperCase()
  const vid    = searchParams.get('vid')  || 'dQw4w9WgXcQ'
  const nick   = searchParams.get('nick') || 'Viewer'
  const isHost = searchParams.get('host') === 'true'

  return (
    <>
      {toast && <Toast msg={toast.msg} kind={toast.kind} />}
      <WatchRoom
        rcode={rcode}
        vid={vid}
        nick={nick}
        isHost={isHost}
        showToast={showToast}
        onLeave={() => router.push('/')}
      />
    </>
  )
}
