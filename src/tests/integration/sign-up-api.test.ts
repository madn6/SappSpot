// Silence "MongoDB Connected" log
beforeAll(() => {
	jest.spyOn(console, 'log').mockImplementation(() => {});
});

// ✅ Mock cookies from next/headers
jest.mock('next/headers', () => ({
	cookies: jest.fn(() => ({
		set: jest.fn(),
		get: jest.fn()
	}))
}));

// ✅ Mock rate limiter and controller
jest.mock('../../lib/ratelimiter', () => ({
	limiter: jest.fn()
}));

jest.mock('../../controllers/auth.controller', () => ({
	registerUser: jest.fn()
}));

import mongoose from 'mongoose';
import handler from '@/app/api/auth/sign-up/route';
import { registerUser } from '../../controllers/auth.controller';
import { limiter } from '../../lib/ratelimiter';

interface MockRequestData {
	displayName: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

function createMockRequest(data: Partial<MockRequestData>) {
	return new Request('http://localhost:3000/api/auth/sign-up', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-forwarded-for': 'test-ip-1'
		},
		body: JSON.stringify(data)
	});
}

// To check if the route (route.ts) correctly responds to whatever the mocked controller returns.
describe('🔐 Sign-up Route', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return 429 when rate limit exceeded', async () => {
		(limiter as jest.Mock).mockImplementation(() => {
			throw new Error('Too many sign-up attempts, please wait a minute');
		});

		const req = createMockRequest({
			displayName: 'Mathan',
			username: 'mathan_dev',
			email: 'test@example.com',
			password: '12345678',
			confirmPassword: '12345678'
		});

		const res = await handler(req);
		const data = await res.json();

		expect(res.status).toBe(429);
		expect(data.error).toBe('Too many sign-up attempts, please wait a minute');
	});

	it('should return 400 when required fields are missing', async () => {
		(limiter as jest.Mock).mockResolvedValue(undefined);

		(registerUser as jest.Mock).mockResolvedValue({
			error: 'Missing required fields',
			status: 400
		});

		const req = createMockRequest({
			displayName: '',
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		});

		const res = await handler(req);
		const data = await res.json();

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(data.error).toMatch(/missing required fields/i);
	});

	it('should return 400 when passwords do not match', async () => {
		(limiter as jest.Mock).mockResolvedValue(undefined);

		(registerUser as jest.Mock).mockResolvedValue({
			error: 'Passwords do not match',
			status: 400
		});

		const req = createMockRequest({
			displayName: 'Mathan',
			username: 'mathan_dev',
			email: 'test@example.com',
			password: '12345678',
			confirmPassword: '87654321'
		});

		const res = await handler(req);
		const data = await res.json();

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(data.error).toMatch(/passwords do not match/i);
	});

	it('should return 201 on successful registration', async () => {
		(limiter as jest.Mock).mockResolvedValue(undefined);

		(registerUser as jest.Mock).mockResolvedValue({
			user: {
				id: '1',
				displayName: 'Test User',
				username: 'testuser',
				email: 'new@example.com',
				profileImage: null
			},
			accessToken: 'mock-access',
			refreshToken: 'mock-refresh'
		});

		const req = createMockRequest({
			displayName: 'Test User',
			username: 'testuser',
			email: 'new@example.com',
			password: 'strongpassword',
			confirmPassword: 'strongpassword'
		});

		const res = await handler(req);
		const json = await res.json();

		expect(res.status).toBe(201);
		expect(json.user.displayName).toBe('Test User');
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
