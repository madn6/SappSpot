'use client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ExploreLink() {
	const pathname = usePathname();
	const isActive = pathname === '/explore';

	return (
		<div
			className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
				isActive ? 'bg-sapp-surface text-sapp-primary' : ' hover:bg-sapp-border'
			}`}
		>
			<Search className="text-xl" />
			<Link href="/explore" className="text-sm font-medium hover:underline">
				Explore Food
			</Link>
		</div>
	);
}
