import Fastify from 'fastify';
import fastifyMysql from '@fastify/mysql';
import { DB_CONFIG } from './config/database.js';
import { routes } from './src/routes/index.js';
import cors from '@fastify/cors'
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import middie from '@fastify/middie';
// import {userSessionMiddleware} from './src/middlewares/userSessionMiddleware.js'
import fastifyMultipart from '@fastify/multipart';


const app = Fastify({
  logger: true,
});

// Register multipart plugin
await app.register(fastifyMultipart, {
  attachFieldsToBody: true
});

// Register MySQL plugin
await app.register(fastifyMysql, DB_CONFIG);
await app.register(middie);
await app.register(fastifyCookie);
await app.register(fastifySession, {
  cookieName: 'user_session',
  secret: '55bbc4b8d397ee9b397de8c128413c39415b074cb6e4220389e7816a1b465143', // Replace with a secure key
  cookie: {
    secure: true, // Set to `true` in production (requires HTTPS)
    maxAge: 1000 * 60 * 60 * 24 * 100, // 100 days in milliseconds
    httpOnly: true,
    sameSite: 'lax'
  },
  saveUninitialized: false, // Only save sessions with data
});

const allowedOriginis = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http:// 86.98.85.100:3001",
  "http:// 86.98.85.100",
  "http:// 94.200.50.118",
  "http:// 94.200.50.118:3001",
]

// CORS
app.register(cors, {
  origin: allowedOriginis,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight requests
  allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed in the request
  credentials: true, // Allow cookies and credentials
});

// Register Routes
app.register(routes);


// Middlewares
// app.use(userSessionMiddleware)

/**
 * Run the server!
 */
const start = async () => {
  try {
    app.log.info('Starting Fastify server...');
    await app.listen({ port: 5001, host: '0.0.0.0' });
    app.log.info(`Server running at http://localhost:3001`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
