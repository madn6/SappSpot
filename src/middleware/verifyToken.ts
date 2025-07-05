import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
	const accessToken = request.cookies.get('accessToken')?.value;

	if (!accessToken) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	try {
		jwt.verify(accessToken, process.env.JWT_SECRET!);
		return NextResponse.next();
	} catch {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}
}

