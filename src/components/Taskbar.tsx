import React from 'react';
import { motion } from 'framer-motion';
import { ease5Steps } from '../utils';
import TaskbarContents from './TaskbarContents';

const Taskbar: React.FC = () => {
	return (
		<motion.nav
			className="fixed bottom-0 w-full p-4 font-bold md:top-0 md:bottom-auto z-30 outline outline-2 outline-white-primary flex text-white backdrop-blur-parent bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70% md:p-0"
			variants={{
				unloaded: { opacity: 0, y: '-100%' },
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
			<TaskbarContents />
		</motion.nav>
	);
};

export default Taskbar;
