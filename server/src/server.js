import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

let server;

async function start() {
  await connectDb();
  server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'API server listening'));
}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down API server');
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  process.exit(0);
}

process.once('SIGINT', () => { shutdown('SIGINT').catch(error => { logger.error(error, 'Shutdown failed'); process.exit(1); }); });
process.once('SIGTERM', () => { shutdown('SIGTERM').catch(error => { logger.error(error, 'Shutdown failed'); process.exit(1); }); });

start().catch(error => {
  logger.error(error, 'Unable to start API server');
  process.exit(1);
});
