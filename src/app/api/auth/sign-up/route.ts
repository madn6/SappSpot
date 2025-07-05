// app/api/auth/sign-up/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { registerUser } from '@/controllers/auth.controller';

export async function POST(req: Request) {
	await dbConnect(); 

	const body = await req.json();
	const result = await registerUser(body);

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

	return NextResponse.json({ user: result.user }, { status: 201 });
}
