import * as React from 'react';
import { useContext } from 'react';
import { MobileContext } from './OS';

import MobileTaskbar from './MobileTaskbar';
import TaskbarContents from './TaskbarContents';
import { motion } from 'framer-motion';
import { easeSteps } from '../utils';

const Taskbar: React.FC = () => {
	const isMobile = useContext(MobileContext);

	return (
		<motion.nav
			className="fixed bottom-0 w-full p-4 font-bold md:top-0 md:bottom-auto md:p-0 z-30"
			variants={{
				unloaded: { opacity: 0, y: '-100%' },
				loaded: {
					opacity: 1,
					y: 0,
					transition: {
						type: 'tween',
						ease: easeSteps(5),
						delay: 0.5,
					},
				},
			}}
		>
			<div className="outline outline-2 outline-white-primary flex text-white backdrop-blur-parent bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70% relative">
				{isMobile ? <MobileTaskbar /> : <TaskbarContents />}
			</div>
		</motion.nav>
	);
};

export default Taskbar;
