export default {
  routes: [
    {
      method: 'GET',
      path: '/messages',
      handler: 'message.find',
      config: {
        auth: {
          scope: ['find']
        }
      }
    },
    {
      method: 'POST',
      path: '/messages',
      handler: 'message.create',
      config: {
        auth: {
          scope: ['create']
        }
      }
    }
  ]
};
