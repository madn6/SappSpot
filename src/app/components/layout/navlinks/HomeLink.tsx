'use client';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeLink() {
	const pathname = usePathname();
	const isActive = pathname === '/';

	return (
		<div
			className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
				isActive ? 'bg-sapp-surface text-sapp-primary' : ' hover:bg-sapp-border'
			}`}
		>
			<Home className="text-xl" />
			<Link href="/" className="text-sm font-medium hover:underline">
				Home
			</Link>
		</div>
	);
}
