import { redis } from './upstash';

// lib/limiter.ts
export const limiter = async (key: string, limit = 5, windowSec = 60) => {
	if (process.env.NODE_ENV === 'test') return;

	const count = await redis.incr(key);

	if (count === 1) {
		await redis.expire(key, windowSec);
	}

	if (count > limit) {
		throw new Error('Too many attempts, please wait');
	}
};
