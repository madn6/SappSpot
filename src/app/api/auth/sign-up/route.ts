// app/api/auth/sign-up/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { registerUser } from '@/controllers/auth.controller';
import { limiter } from '@/lib/ratelimiter';

export async function POST(req: Request) {
	await dbConnect();

	//rate limiting
	const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

	try {
		await limiter(`signup:${ip}`, 3, 3600);
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
	const result = await registerUser(body);

	if ('error' in result) {
		return new Response(JSON.stringify({ error: result.error }), {
			status: result.status || 400
		});
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

	return NextResponse.json({ user: result.user }, { status: 201 });
}

export default POST;
