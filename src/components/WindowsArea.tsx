import React, { useContext, useRef } from 'react';
import Window from './Window';
import { useBoundStore, useMobileStore } from '../store';
import { AnimatePresence } from 'framer-motion';
import { MobileContext } from './OS';
import Menu from './Menu';

const WindowsArea = () => {
	const windowsAreaRef = useRef(null);
	const [windows, bringToFrontReq, deleteWindows] = useBoundStore(state => [
		state.windows,
		state.bringToFront,
		state.deleteWindow,
		state.deleteWindows,
	]);

	const isMobile = useContext(MobileContext);
	const [menuOpen, windowOpen] = useMobileStore(state => [
		state.menuOpen,
		state.windowOpen,
	]);

	// The extra div is only there to prevent overlap with the taskbar
	return (
		<div className="absolute w-full h-full md:pt-14 top-0 pointer-events-none">
			<div ref={windowsAreaRef} className="h-full relative">
				<AnimatePresence>
					{isMobile && menuOpen && (
						<Menu
							windows={windows}
							bringToFrontReq={bringToFrontReq}
							deleteWindows={deleteWindows}
						/>
					)}
					{(isMobile
						? menuOpen || windows.length === 0
							? []
							: windowOpen
							? [windows[windows.length - 1]]
							: []
						: windows
					).map(window => (
						<Window
							key={window.id}
							{...window}
							area={windowsAreaRef}
							initialLocation={{ x: 100, y: 100 }}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default WindowsArea;
