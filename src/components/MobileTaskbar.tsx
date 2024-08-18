import React, { memo } from 'react';
import { useBoundStore, useMobileStore } from '../store';
import { StaticImage } from 'gatsby-plugin-image';
import { ease5Steps } from '../utils';
import { motion } from 'framer-motion';
import MobileTaskbarPanel from './MobileTaskbarPanel';

const MobileTaskbar = memo(() => {
	const [toggleMenu, home, back, windowOpen, menuOpen] = useMobileStore(
		state => [
			state.toggleMenu,
			state.home,
			state.back,
			state.windowOpen,
			state.menuOpen,
		]
	);
	const windows = useBoundStore(state => state.windows.length);

	return (
		<>
			<MobileTaskbarPanel />
			<motion.nav
				className="fixed bottom-0 w-full p-0 font-bold z-30 short:px-4 short:py-2"
				variants={{
					unloaded: { opacity: 0, y: '100%' },
					loaded: {
						opacity: 1,
						y: 0,
						transition: {
							type: 'tween',
							ease: ease5Steps,
							delay: 0.5,
						},
					},
				}}
			>
				<div
					className={`outline-2 outline-white-primary flex text-white from-black-primary/75 to-dark-primary/75 from-25% to-70% relative ${(!windowOpen || menuOpen) && 'bg-gradient-to-r outline'}`}
				>
					<button
						className="grow flex justify-center py-2"
						type="button"
						onClick={() => {
							if (windows == 0 && menuOpen) return home();
							toggleMenu();
						}}
					>
						<StaticImage
							src="../images/menu.png"
							alt="menu"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
					<button
						className="grow flex justify-center py-2"
						type="button"
						onClick={() => home()}
					>
						<StaticImage
							src="../images/home.png"
							alt="home"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
					<button
						className="grow flex justify-center py-2"
						type="button"
						onClick={() => back()}
					>
						<StaticImage
							src="../images/back.png"
							alt="back"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
				</div>
			</motion.nav>
		</>
	);
});

export default MobileTaskbar;
