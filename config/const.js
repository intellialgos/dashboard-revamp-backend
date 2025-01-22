import dotenv from 'dotenv';
dotenv.config();

export const APP_ID = process.env.API_APP_ID ?? "";
export const API_SECRET_KEY = process.env.API_SECRET_KEY ?? "";