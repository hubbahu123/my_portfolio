import * as React from 'react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import ShortcutsArea from './ShortcutsArea';
import Window from './Window';

const Desktop: React.FC = () => {
	const desktopAreaRef = useRef(null!);
	const highestIndex = useRef<number>(5);
	const [windows, setWindows] = useState([{ id: 1, zIndex: 1 }]);

	const bringToFrontRequest = (id: number) => {
		const windowsCopy = [...windows];
		const requestedWindowIndex = windowsCopy.findIndex(
			window => window.id === id
		);

		if (requestedWindowIndex == -1) return;
		if (windowsCopy[requestedWindowIndex].zIndex == highestIndex.current)
			return;
		windowsCopy[requestedWindowIndex].zIndex = ++highestIndex.current;

		setWindows(windowsCopy);
	};

	return (
		<motion.main ref={desktopAreaRef} className='w-full h-full relative'>
			<ShortcutsArea area={desktopAreaRef} />
			{/* {windows.map(({ id, zIndex }) => (
				<Window
					key={id}
					area={desktopAreaRef}
					bringToFrontRequest={() => bringToFrontRequest(id)}
					zIndex={zIndex}
				/>
			))} */}
		</motion.main>
	);
};

export default Desktop;
