import dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  promise: true
};