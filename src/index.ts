import { Server } from 'socket.io';
import { Strapi } from '@strapi/types/dist/core';
import { Message } from './api/message/content-types/message/message';

interface MessageForClient {
  id: number;
  text: string;
  timestamp: string;
  userId: number | undefined;
  username: string | undefined;
}

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
        
        // Using the newer API signature
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id },
          populate: { role: true }
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

    io.on('connection', async (socket) => {
      console.log('A user connected:', socket.id);
      const user = socket.data.user;
      
      try {
        // Fetch recent messages from database
        const messages = await strapi.db.query('api::message.message').findMany({
          orderBy: { timestamp: 'desc' },
          limit: 50,
          populate: ['sender']
        }) as Message[];

        // Format and send existing messages to newly connected client
        const formattedMessages: MessageForClient[] = messages.reverse().map(message => ({
          id: message.id,
          text: message.text,
          timestamp: message.timestamp,
          userId: message.sender?.id,
          username: message.sender?.username
        }));

        socket.emit('previous-messages', formattedMessages);

        // Handle new messages
        socket.on('message', async (messageText: string) => {
          try {
            console.log('Received message:', messageText);

            // Create message in database using the newer API
            const message = await strapi.db.query('api::message.message').create({
              data: {
                text: messageText,
                sender: user.id,
                timestamp: new Date().toISOString()
              },
              populate: ['sender']
            }) as Message;

            // Format message for client
            const messageForClient: MessageForClient = {
              id: message.id,
              text: message.text,
              timestamp: message.timestamp,
              userId: message.sender?.id,
              username: message.sender?.username
            };

            // Broadcast to all clients
            io.emit('message', messageForClient);
          } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', 'Failed to save message');
          }
        });

        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        socket.emit('error', 'Failed to fetch messages');
      }
    });

    io.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    strapi.app.io = io; // Store io instance in strapi
  },
};
