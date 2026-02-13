const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

let io;

function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: user ${socket.userId}`);
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: user ${socket.userId}`);
    });
  });
}

function broadcastChoreEvent(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

module.exports = { initializeSocket, broadcastChoreEvent };
