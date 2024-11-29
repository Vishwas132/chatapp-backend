module.exports = ({ env }) => ({
  connection: {
    client: env('NODE_ENV') === 'production' ? 'postgres' : 'sqlite',
    connection: env('NODE_ENV') === 'production'
      ? {
          connectionString: env('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
        }
      : {
          filename: '.tmp/data.db',
        },
    useNullAsDefault: true,
  },
});
