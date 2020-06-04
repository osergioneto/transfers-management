// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gostack_desafio06',
  entities: ['./src/models/*.ts'],
  migrations: ['./src/database/migrations/*.ts'],
  logging: ['query', 'error'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
};
