import { Server } from 'socket.io';

export default ({ strapi }) => {
  // Store messages in memory (for demo purposes)
  const messages = [];
  const MAX_MESSAGES = 50;

  strapi.server.httpServer.once('listening', () => {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      // Send existing messages to newly connected client
      socket.emit('previous-messages', messages);

      socket.on('message', (message) => {
        const timestamp = new Date().toISOString();
        const messageWithTimestamp = {
          id: messages.length + 1,
          text: message,
          timestamp,
          userId: socket.id // Using socket.id as user identifier for now
        };

        // Add message to memory store
        messages.push(messageWithTimestamp);
        if (messages.length > MAX_MESSAGES) {
          messages.shift(); // Remove oldest message if limit exceeded
        }

        // Broadcast the message to all connected clients
        io.emit('message', messageWithTimestamp);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    strapi.io = io;
  });

  return () => {};
};
