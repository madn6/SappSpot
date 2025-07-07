import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/Auth.model';

export async function GET() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken')?.value;

	if (!accessToken) {
		return NextResponse.json({ error: 'No token' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as { userId: string };

		const user = await User.findById(decoded.userId);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			userId: user._id,
			profileImage: user.profileImage,
			name: user.username,
			email: user.email
		});
	} catch (err) {
		console.error('❌ Token expired or invalid', err);
		return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 });
	}
}
