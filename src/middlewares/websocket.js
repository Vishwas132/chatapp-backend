module.exports = (config, { strapi }) => {
  const io = require('socket.io')(strapi.server.httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (message) => {
      // Echo the message back to the client
      socket.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return {
    initialize() {
      strapi.io = io;
    },
  };
};
