import Logo from '../../../app/assests/images/officialLogo.png';
import Image from 'next/image';
import { ExploreLink, FoundDishLink, HomeLink, ProfileLink, SettingsLink } from './navlinks';

export default function LeftSidebar() {
	return (
		<div>
			<Image src={Logo} alt="SappSpot Logo" width={80} height={80} className="mb-4 " />
			<div className="flex flex-col gap-2">
				<HomeLink />
				<ExploreLink />
				<FoundDishLink />
				<ProfileLink />
				<SettingsLink/>
			</div>
		</div>
	);
}
