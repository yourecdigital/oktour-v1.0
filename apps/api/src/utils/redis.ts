import { createClient } from 'redis';
import { env } from '../env';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

// Connect to Redis
redisClient.connect().catch(console.error);

export default redisClient;
