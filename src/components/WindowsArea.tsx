import React, { useContext, useRef } from 'react';
import Window from './Window';
import { useBoundStore, useMobileStore } from '../store';
import { AnimatePresence } from 'framer-motion';
import { MobileContext } from './OS';
import Menu from './Menu';

const WindowsArea = () => {
	const windowsAreaRef = useRef(null);
	const [windows, bringToFrontReq, deleteReq, deleteWindows] = useBoundStore(
		state => [
			state.windows,
			state.bringToFront,
			state.deleteWindow,
			state.deleteWindows,
		]
	);

	const isMobile = useContext(MobileContext);
	const [menuOpen, toggleMenu] = useMobileStore(state => [
		state.menuOpen,
		state.toggleMenu,
	]);

	return (
		<div
			ref={windowsAreaRef}
			className='absolute w-full h-full md:mt-14 top-0 pointer-events-none'
		>
			<AnimatePresence>
				{isMobile && menuOpen && (
					<Menu
						windows={windows}
						bringToFrontReq={bringToFrontReq}
						deleteWindows={deleteWindows}
						toggleMenu={toggleMenu}
					/>
				)}
				{(isMobile
					? menuOpen || windows.length === 0
						? []
						: [windows[windows.length - 1]]
					: windows
				).map(({ id }) => (
					<Window
						key={id}
						area={windowsAreaRef}
						initialLocation={{ x: 0, y: 100 }}
						bringToFrontReq={() => bringToFrontReq(id)}
						deleteReq={() => deleteReq(id)}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};

export default WindowsArea;