'use client';
import { BadgePlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FoundDishLink() {
	const pathname = usePathname();
	const isActive = pathname === '/add-dish';

	return (
		<div
			className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
				isActive ? 'bg-sapp-surface text-sapp-primary' : ' hover:bg-sapp-border'
			}`}
		>
			<BadgePlus className="text-xl" />
			<Link href="/add-dish" className="text-sm font-medium hover:underline">
				Found a Dish
			</Link>
		</div>
	);
}
