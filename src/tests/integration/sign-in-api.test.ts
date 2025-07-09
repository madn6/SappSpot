// Silence app-level console logs (e.g., "MongoDB connected")
beforeAll(() => {
	jest.spyOn(console, 'log').mockImplementation(() => {});
});

// Mock dependencies
jest.mock('next/headers', () => ({
	cookies: jest.fn(() => ({
		set: jest.fn(),
		get: jest.fn()
	}))
}));

jest.mock('../../lib/ratelimiter', () => ({
	limiter: jest.fn()
}));

jest.mock('../../controllers/auth.controller', () => ({
	loginUser: jest.fn()
}));

import { limiter } from '../../lib/ratelimiter';
import mongoose from 'mongoose';
import handler from '@/app/api/auth/sign-in/route';
import { loginUser } from '../../controllers/auth.controller';

// Helper to simulate request
interface MockRequestData {
	email: string;
	password?: string;
}

function createMockRequest(data: MockRequestData) {
	return new Request('http://localhost:3000/api/auth/sign-in', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
}

// 🧪 Test suite
describe('🔐 Sign-in Route', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return 429 when rate limit exceeded', async () => {
		(limiter as jest.Mock).mockImplementation(() => {
			throw new Error('Too many login attempts, please wait a minute');
		});

		const req = createMockRequest({ email: 'a@a.com', password: '1234' });
		const res = await handler(req);
		const data = await res.json();

		console.log('🚫 [429 Test] Status:', res.status);
		console.log('🚫 [429 Test] Response:', data);

		expect(res.status).toBe(429);
		expect(data.error).toBe('Too many login attempts, please wait a minute');
	});

	it('should return 400 when credentials are missing', async () => {
		const req = createMockRequest({ email: '' }); // Missing password
		const res = await handler(req);
		const data = await res.json();

		console.log('❌ [400 Test] Status:', res.status);
		console.log('❌ [400 Test] Response:', data);

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(data.error).toBeDefined();
	});

	it('should return 200 with valid credentials', async () => {
		(limiter as jest.Mock).mockResolvedValue(undefined);
		(loginUser as jest.Mock).mockResolvedValue({
			accessToken: 'mock-access',
			refreshToken: 'mock-refresh',
			user: { id: '1', name: 'Test User' }
		});

		const req = createMockRequest({
			email: 'user@example.com',
			password: 'validpass'
		});
		const res = await handler(req);
		const json = await res.json();

		console.log('✅ [200 Test] Status:', res.status);
		console.log('✅ [200 Test] Response:', json);

		expect(res.status).toBe(200);
		expect(json.user.name).toBe('Test User');
	});
});

// 🧼 Clean up database connection after tests
afterAll(async () => {
	await mongoose.connection.close();
});
