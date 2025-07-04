'use client';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLink() {
	const pathname = usePathname();
	const isActive = pathname === '/settings';

	return (
		<div
			className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
				isActive ? 'bg-sapp-surface text-sapp-primary' : ' hover:bg-sapp-border'
			}`}
		>
			<Settings className="text-xl" />
			<Link href="/settings" className="text-sm font-medium hover:underline">
				Settings
			</Link>
		</div>
	);
}
