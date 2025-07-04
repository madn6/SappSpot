import LeftSidebar from '../components/layout/LeftSideBar';
import RightSidebar from '../components/layout/RightSideBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<aside className="hidden bg-sapp-surface md:block w-48 lg:w-64 border-r border-sapp-border p-4">
				<LeftSidebar />
			</aside>

			<main className="flex-1 max-w-full md:max-w-3xl mx-auto  bg-sapp-background p-4">{children}</main>

			<aside className="hidden bg bg-sapp-surface lg:block w-72 border-sapp-border border-l p-4">
				<RightSidebar />
			</aside>
		</div>
	);
}
