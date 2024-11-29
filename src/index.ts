import { Server } from 'socket.io';
import { Strapi } from '@strapi/types/dist/core';

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
  bootstrap({ strapi }: { strapi: Strapi }) {
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

    // Middleware to verify JWT token
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication token missing');
        }

        // Verify JWT token using Strapi's service
        const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
          populate: ['role'],
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Attach user to socket
        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      const user = socket.data.user;
      
      // Send existing messages to newly connected client
      socket.emit('previous-messages', messages);

      socket.on('message', (message) => {
        console.log('Received message:', message);
        const messageWithMetadata = {
          id: messages.length + 1,
          text: message,
          timestamp: new Date().toISOString(),
          userId: user.id,
          username: user.username
        };

        messages.push(messageWithMetadata);
        if (messages.length > MAX_MESSAGES) {
          messages.shift();
        }

        io.emit('message', messageWithMetadata);
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

    strapi.app.io = io; // Store io instance in strapi
  },
};
