import Redis from 'ioredis';
import { config } from './config';
import { log } from '../utils/logger';

const redis = new Redis(config.redis.url, {
  tls: {} // Needed for Upstash TLS
});

redis.on('error', (error) => {
  log.error('Redis connection error', { error: error.message });
});

redis.on('connect', () => {
  log.info('Redis connected successfully');
});

export default redis; 