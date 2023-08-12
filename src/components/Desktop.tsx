import * as React from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import ShortcutsArea from './ShortcutsArea';
import Window from './Window';
import { useBoundStore } from '../store';

const Desktop: React.FC = () => {
	const desktopAreaRef = useRef(null!);
	const windows = useBoundStore(state => state.windows);
	const bringToFrontReq = useBoundStore(state => state.bringToFront);

	return (
		<motion.main ref={desktopAreaRef} className='w-full h-full relative'>
			<ShortcutsArea area={desktopAreaRef} />
			{windows.map(({ id }) => (
				<Window
					key={id}
					area={desktopAreaRef}
					bringToFrontReq={() => bringToFrontReq(id)}
				/>
			))}
		</motion.main>
	);
};

export default Desktop;
