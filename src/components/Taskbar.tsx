import * as React from 'react';
import { useContext } from 'react';
import { MobileContext } from './OS';

import MobileTaskbar from './MobileTaskbar';
import TaskbarContents from './TaskbarContents';

const Taskbar: React.FC = () => {
	const isMobile = useContext(MobileContext);

	return (
		<nav className="fixed bottom-0 w-full p-4 font-bold md:top-0 md:bottom-auto md:p-0 z-40">
			<div className="outline outline-2 outline-white-primary flex text-white backdrop-blur-parent bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70%">
				{isMobile ? <MobileTaskbar /> : <TaskbarContents />}
			</div>
		</nav>
	);
};

export default Taskbar;
