import { createApp } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';

const server = createApp().listen(config.port, () => console.info(`Sivorment API listening on http://localhost:${config.port}`));
const shutdown = async () => { server.close(async () => { await pool?.end(); process.exit(0); }); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
