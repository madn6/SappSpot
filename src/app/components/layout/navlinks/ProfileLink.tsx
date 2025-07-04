'use client';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileLink() {
	const pathname = usePathname();
	const isActive = pathname === '/user-profile';

	return (
		<div
			className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
				isActive ? 'bg-sapp-surface text-sapp-primary' : ' hover:bg-sapp-border'
			}`}
		>
			<User className="text-xl" />
			<Link href="/user-profile" className="text-sm font-medium hover:underline">
				My Profile
			</Link>
		</div>
	);
}
