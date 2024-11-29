import path from 'path';

interface Env {
  (key: string, defaultValue?: any): any;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
}

export default ({ env }: { env: Env }) => ({
  connection: {
    client: 'postgres',
    connection: env('NODE_ENV') === 'production'
      ? {
          connectionString: env('DATABASE_URL'),
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: env('DATABASE_HOST', '127.0.0.1'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'chatapp'),
          user: env('DATABASE_USERNAME', 'postgres'),
          password: env('DATABASE_PASSWORD', 'postgres'),
          schema: env('DATABASE_SCHEMA', 'chatapp'),
        },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
      acquireTimeoutMillis: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT', 30000),
      idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT', 30000),
    },
  },
});
