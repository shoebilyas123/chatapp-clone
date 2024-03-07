// Global Imports
import path from 'path';
import { readFileSync } from 'node:fs';

interface IENV_CONFIG {
  MONGO_URI: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  NODE_ENV: 'development' | 'production';
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  REGION: string;
  BUCKET_NAME: string;
  ACCESS_KEY_ID: string;
  SECRET_ACCESS_KEY: string;
}

/**
 *  @description Fetches the environment variable from .env file.
 * @param {string} env_loc If provided searches in that location otherwise searches for the env file in server/config.env
 * @returns {IENV_CONFIG} Environment variables
 */
export function getEnvConfig(env_loc?: string): IENV_CONFIG {
  let _envs: unknown = {};

  const _env_file_content = readFileSync(
    path.resolve(__dirname, `../${env_loc || 'config.env'}`),
    { encoding: 'utf-8' }
  );

  _envs = _env_file_content
    .split('\n')
    .reduce(
      (acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }),
      {}
    );

  _envs = { ...(_envs as Record<any, string>), ...process.env };

  return _envs as IENV_CONFIG;
}
