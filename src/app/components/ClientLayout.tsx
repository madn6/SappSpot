// components/ClientLayout.tsx
'use client';

import { useEffect } from 'react';
import api from '@/lib/axios';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const check = async () => {
			try {
				await api.get('/auth/check-auth');
			} catch {
				console.log('❌ Auth check failed');
			}
		};
		check();
	}, []);

	return <>{children}</>;
}
