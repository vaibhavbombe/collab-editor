require('dotenv').config()
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const { setupWSConnection } = require('y-websocket/bin/utils')

const app = express()
app.get('/', (req, res) => res.send('Collab editor server is running'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req)
})

const PORT = process.env.PORT || 4001
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))