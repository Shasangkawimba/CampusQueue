const { Server } = require('socket.io');

let io;

class SocketService {
  init(server) {
    io = new Server(server, {
      cors: {
        origin: '*', // For development. Adjust for production
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Client joins a specific loket room to get its updates
      socket.on('join_loket', (loketId) => {
        if (!loketId) return;
        const roomName = `loket_${loketId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room: ${roomName}`);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    console.log('Socket.io initialized');
  }

  getIo() {
    if (!io) {
      console.warn('Socket.io is not initialized yet');
    }
    return io;
  }

  /**
   * Broadcast an update to all clients in a specific loket's room
   * @param {string|number} loketId 
   * @param {string} action Type of action (e.g., 'TAKE_TICKET', 'CALL_NEXT')
   * @param {object} data The payload data
   */
  broadcastQueueUpdate(loketId, action, data) {
    if (!io) {
      console.error('Cannot broadcast: Socket.io is not initialized');
      return;
    }
    
    const roomName = `loket_${loketId}`;
    io.to(roomName).emit('queue:update', { action, data, timestamp: new Date().toISOString() });
    console.log(`[Socket Broadcast] -> ${roomName}: action=${action}`);
  }
}

module.exports = new SocketService();
