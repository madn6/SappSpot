import dbConnect from '@/config/db';
import { loginUser } from '@/controllers/auth.controller';
import { limiter } from '@/lib/ratelimiter';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	await dbConnect();
	const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

	try {
		await limiter(`signin:${ip}`, 5, 60);
	} catch (error) {
		return NextResponse.json(
			{
				error:
					typeof error === 'object' && error !== null && 'message' in error
						? (error as { message: string }).message
						: 'Too many attempts'
			},
			{ status: 429 }
		);
	}

	const body = await req.json();
	const result = await loginUser(body);

	if ('error' in result) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}

	const cookieStore = await cookies();

	cookieStore.set('accessToken', result.accessToken, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 15 * 60
	});

	cookieStore.set('refreshToken', result.refreshToken, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60
	});

	return NextResponse.json({ user: result.user });
}
