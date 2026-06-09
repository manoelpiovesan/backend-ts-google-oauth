import {Sequelize} from 'sequelize-typescript';
import path from 'path';

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB || 'backend_node',
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  dialect: 'postgres',
  models: [path.join(__dirname, '../models')],
  modelMatch: (filename, member) => {
    return member !== 'default';
  },
  logging: false,
});

export const initDb = async () => {
  try {
    await sequelize.sync();
    console.log('[INFO] Database synchronized successfully');
  } catch (err) {
    console.error('[ERROR] Unable to synchronize the database:', err);
  }
};

export {sequelize};
