import { Server } from 'socket.io';

export default () => {
  return async (ctx, next) => {
    if (ctx.path === '/websocket' && !strapi.io) {
      const io = new Server(strapi.server.httpServer, {
        path: '/websocket',
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"],
          allowedHeaders: ["*"],
          credentials: true
        },
        transports: ['websocket', 'polling']
      });

      // Store messages in memory
      const messages = [];
      const MAX_MESSAGES = 50;

      io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.emit('previous-messages', messages);

        socket.on('message', (message) => {
          console.log('Received message:', message);
          const messageWithTimestamp = {
            id: messages.length + 1,
            text: message,
            timestamp: new Date().toISOString(),
            userId: socket.id
          };

          messages.push(messageWithTimestamp);
          if (messages.length > MAX_MESSAGES) {
            messages.shift();
          }

          io.emit('message', messageWithTimestamp);
        });

        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });

      strapi.io = io;
    }

    await next();
  };
};
