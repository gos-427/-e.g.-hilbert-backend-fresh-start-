const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS for WebSocket communication from Android app
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Simulated Hilbert Node Mesh Routing
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('message_from_gos427', (data) => {
    console.log('📨 From GOS-427:', data);
    socket.broadcast.emit('relay_from_gos427', { ...data });
  });

  socket.on('message_from_gpt', (data) => {
    console.log('📨 From GPT Agent:', data);
    socket.broadcast.emit('relay_from_gpt', { ...data });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Hilbert Mesh Backend is Running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
