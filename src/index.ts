import { Server } from 'socket.io';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Store messages in memory
    const messages: any[] = [];
    const MAX_MESSAGES = 50;

    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      
      // Send existing messages to newly connected client
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

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    io.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    strapi.io = io; // Store io instance in strapi
  },
};
