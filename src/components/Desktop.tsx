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
import WebGL from 'three/examples/jsm/capabilities/WebGL';

const Desktop: React.FC = () => {
	const [introDone, setIntroDone] = usePersistent(
		'introDone',
		!WebGL.isWebGLAvailable(),
		str => str === 'true'
	);

	return (
		<motion.main className="w-full h-full relative">
			{introDone ? (
				<Loader>
					<Background />
					<Taskbar />
					<ShortcutsArea />
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
