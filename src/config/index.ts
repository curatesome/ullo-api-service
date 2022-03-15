import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  /** database */
  DB_USER,
  DB_PW,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  /** cache */
  CACHE_USER,
  CACHE_PW,
  CACHE_HOST,
  CACHE_PORT,
  CACHE_DATABASE_INDEX,
  /** */
  SECRET_KEY,
  /** log */
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,

  /** oauth service provider */
  OAUTH_KAKAO_API_KEY,
} = process.env;
