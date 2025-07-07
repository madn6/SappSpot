// app/layout.tsx
import ClientLayout from './components/ClientLayout';
import './globals.css';
import type { Metadata } from 'next'; 

export const metadata: Metadata = {
	title: 'SappSpot',
	description: 'A modern social media platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ClientLayout>{children}</ClientLayout> 
			</body>
		</html>
	);
}

// Page loads → ClientLayout → useEffect() → /auth/check-auth
//                   ↓
//          Server returns 401 (expired token)
//                   ↓
//        Axios interceptor triggers
//                   ↓
//         Calls /auth/refresh → gets new token
//                   ↓
//       Retries /auth/check-auth → now it succeeds 
