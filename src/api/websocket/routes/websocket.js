export default {
  routes: [
    {
      method: 'GET',
      path: '/websocket',
      handler: 'websocket.index',
      config: {
        auth: false,
      },
    },
  ],
};
