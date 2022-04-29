import { createClient } from 'redis';
import {
  CACHE_USER,
  CACHE_PW,
  CACHE_HOST,
  CACHE_PORT,
  CACHE_DATABASE_INDEX,
} from '@config';
import { logger } from '@/utils/logger';

const redisUrl = `redis://${
  CACHE_USER ? CACHE_USER + ':' + CACHE_PW + '@' : ''
}${CACHE_HOST}:${CACHE_PORT}/${
  CACHE_DATABASE_INDEX ? CACHE_DATABASE_INDEX : ''
}`;

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('ready', () => {
  logger.info('redis ready');
});

redisClient.on('error', e => {
  logger.error(e);
});
