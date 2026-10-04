import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function randomRoomId() {
  return Math.random().toString(36).slice(2, 8)
}

export default function Home() {
  const [roomInput, setRoomInput] = useState('')
  const navigate = useNavigate()

  const joinRoom = (e) => {
    e.preventDefault()
    const id = roomInput.trim() || randomRoomId()
    navigate(`/room/${id}`)
  }

  return (
    <div style={{ background: '#0B0B0D', minHeight: '100vh', color: '#F5F5F3', fontFamily: 'monospace', padding: '2rem' }}>
      <h1 style={{ color: '#FF6B45' }}>Collab Editor</h1>
      <p style={{ color: '#A6A6AC', marginBottom: '1.5rem' }}>
        Enter a room name to join or create it, or leave blank for a random one.
      </p>
      <form onSubmit={joinRoom} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="room name (optional)"
          style={{ background: '#17171A', border: '1px solid #26262A', borderRadius: '6px', padding: '0.6rem', color: '#F5F5F3', fontFamily: 'monospace' }}
        />
        <button
          type="submit"
          style={{ background: '#FF6B45', color: '#0B0B0D', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Join
        </button>
      </form>
    </div>
  )
}