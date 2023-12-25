import React from 'react';
import { useMobileStore } from '../store';
import { StaticImage } from 'gatsby-plugin-image';

const MobileTaskbar = () => {
	const [toggleMenu, home, back] = useMobileStore(state => [
		state.toggleMenu,
		state.home,
		state.back,
	]);
	return (
		<>
			<button
				className="grow flex justify-center py-2 select-none"
				type="button"
				onClick={() => toggleMenu()}
			>
				<StaticImage
					src="../images/menu.png"
					alt="menu"
					placeholder="none"
					draggable={false}
					className="w-12 h-12"
				/>
			</button>
			<button
				className="grow flex justify-center py-2 select-none"
				type="button"
				onClick={() => home()}
			>
				<StaticImage
					src="../images/home.png"
					alt="home"
					placeholder="none"
					draggable={false}
					className="w-12 h-12"
				/>
			</button>
			<button
				className="grow flex justify-center py-2 select-none"
				type="button"
				onClick={() => back()}
			>
				<StaticImage
					src="../images/back.png"
					alt="back"
					placeholder="none"
					draggable={false}
					className="w-12 h-12"
				/>
			</button>
		</>
	);
};

export default MobileTaskbar;
