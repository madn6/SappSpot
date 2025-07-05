// app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import User from '@/models/Auth.model';
import jwt from 'jsonwebtoken';

export async function POST() {
	console.log('🔁 Refresh API called');

	const cookieStore = await cookies();
	const token = cookieStore.get('refreshToken')?.value;

	if (!token) {
		return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };

		const user = await User.findById(decoded.userId);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
			expiresIn: '15m'
		});

		const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, {
			expiresIn: '7d'
		});

		cookieStore.set('accessToken', newAccessToken, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 15 * 60
		});
		cookieStore.set('refreshToken', newRefreshToken, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60
		});

		return NextResponse.json({ message: 'Token refreshed' });
	} catch {
		return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
	}
}
