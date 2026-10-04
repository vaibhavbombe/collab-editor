import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { yCollab } from 'y-codemirror.next'

const USER_COLORS = ['#FF6B45', '#7C6FF0', '#4AD3C9', '#F7B84B']
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4001'
export default function Room() {
  const { roomId } = useParams()
  const editorRef = useRef(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const doc = new Y.Doc()
    const provider = new WebsocketProvider(WS_URL, roomId, doc)
    const yText = doc.getText('codemirror')

    const userName = `User-${Math.floor(Math.random() * 1000)}`
    const userColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    provider.awareness.setLocalStateField('user', { name: userName, color: userColor })

    const updateUserList = () => {
      const states = Array.from(provider.awareness.getStates().values())
      const list = states
        .map((s) => s.user)
        .filter(Boolean) // a connection with no "user" field set yet, drop it
      setUsers(list)
    }

    provider.awareness.on('change', updateUserList)
    updateUserList() // run once immediately, don't wait for the first change event

    const view = new EditorView({
      doc: yText.toString(),
      extensions: [basicSetup, javascript(), yCollab(yText, provider.awareness)],
      parent: editorRef.current,
    })

    return () => {
      view.destroy()
      provider.destroy()
      doc.destroy()
    }
  }, [roomId])

  return (
    <div style={{ background: '#0B0B0D', minHeight: '100vh', color: '#F5F5F3', fontFamily: 'monospace', padding: '2rem' }}>
      <Link to="/" style={{ color: '#6B6B70', fontSize: '0.8rem' }}>&larr; back</Link>
      <h1 style={{ color: '#FF6B45' }}>Room: {roomId}</h1>

      <div style={{ display: 'flex', gap: '0.6rem', margin: '0.75rem 0 1rem', flexWrap: 'wrap' }}>
        {users.map((user, i) => (
          <span
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#17171A',
              border: '1px solid #26262A',
              borderRadius: '999px',
              padding: '0.25rem 0.7rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.color, display: 'inline-block' }} />
            {user.name}
          </span>
        ))}
      </div>

      <div ref={editorRef} style={{ border: '1px solid #26262A', borderRadius: '8px' }} />
    </div>
  )
}