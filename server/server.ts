// Globa Imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Local Imports
import app from './app';
import ioConnection from './utils/ioConnection';
import * as globalController from './controller/Global.controller';

// Custom Types Imports
import { IRequestHandler } from './types';
import { getEnvConfig } from './utils/env';
import IOSocket from './socket';

// Fetching the envs and exporting it globally for all of the backend server;
export const envs = getEnvConfig();

async function main() {
  //   dotenv.config({ path: path.join(__dirname, 'config.env') });

  if (envs.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/../client/build')));
    app.get('*', globalController.productionHandler);
  } else {
    app.all('*', globalController.globalMiddleware);
  }

  const MONGOURI = envs.MONGO_URI.replace(
    '<USERNAME>',
    envs.DB_USERNAME
  ).replace('<PASSWORD>', envs.DB_PASSWORD);
  const PORT = process.env.PORT || 8000;

  let express_server;

  mongoose.connect(MONGOURI).then((con) => {
    console.log('DB ADDR:', con.connection.host);
    express_server = app.listen(PORT, () => {
      console.log(`Server running at PORT:${PORT}`);
    });
    const io = new IOSocket(express_server, { cors: { origin: '*' } });
    ioConnection(io);
  });
}

main();
