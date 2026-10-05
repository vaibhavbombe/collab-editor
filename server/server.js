require('dotenv').config()
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const { setupWSConnection } = require('y-websocket/bin/utils')
const { MongodbPersistence } = require('y-mongodb-provider')

const mdb = new MongodbPersistence(process.env.MONGODB_URI, {
  collectionName: 'yjs-documents',
  flushSize: 100,
})

const utilsModule = require('y-websocket/bin/utils')
utilsModule.setPersistence({
  bindState: async (docName, ydoc) => {
    const persistedYdoc = await mdb.getYDoc(docName)
    const newUpdates = require('yjs').encodeStateAsUpdate(ydoc)
    mdb.storeUpdate(docName, newUpdates)
    require('yjs').applyUpdate(ydoc, require('yjs').encodeStateAsUpdate(persistedYdoc))

    ydoc.on('update', async (update) => {
      mdb.storeUpdate(docName, update)
    })
  },
  writeState: async () => {},
})

const app = express()
app.get('/', (req, res) => res.send('Collab editor server is running'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5176'

server.on('upgrade', (req, socket, head) => {
  if (req.headers.origin !== ALLOWED_ORIGIN) {
    socket.destroy()
    return
  }
})
wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req)
})

const PORT = process.env.PORT || 4001
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))