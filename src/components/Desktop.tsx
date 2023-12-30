import * as React from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import ShortcutsArea from './ShortcutsArea';
import Background from './Background';
import Taskbar from './Taskbar';
import Intro from './Intro';
import { usePersistent } from '../utils';
import Loader from './Loader';
import WindowsArea from './WindowsArea';
import Modifiers from './Modifiers';

const Desktop: React.FC = () => {
	const desktopAreaRef = useRef(null!);

	const [introDone, setIntroDone] = usePersistent(
		'introDone',
		false,
		str => str === 'true'
	);

	return (
		<motion.main ref={desktopAreaRef} className="w-full h-full relative">
			{introDone ? (
				<Loader>
					<Background />
					<Taskbar />
					<ShortcutsArea area={desktopAreaRef} />
					<WindowsArea />
				</Loader>
			) : (
				<Intro onFinish={() => setIntroDone(true)} />
			)}
			<Modifiers />
		</motion.main>
	);
};

export default Desktop;
