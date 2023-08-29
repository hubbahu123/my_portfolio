import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { Window } from '../store/types';
import WindowJSX from './Window';

interface MenuProps {
	windows: Window[];
	bringToFrontReq: Function;
	deleteWindows: Function;
	toggleMenu: Function;
}

const Menu: React.FC<MenuProps> = ({
	windows,
	bringToFrontReq,
	deleteWindows,
	toggleMenu,
}) => {
	const windowsArea = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!windowsArea.current) return;
		windowsArea.current.scrollTo(windowsArea.current.scrollWidth, 0);
	}, [windowsArea]);

	return (
		<motion.div
			animate={{
				backdropFilter: 'blur(24px)',
				WebkitBackdropFilter: 'blur(24px)',
			}}
			exit={{
				backdropFilter: 'blur(0px)',
				WebkitBackdropFilter: 'blur(0px)',
				opacity: 0,
			}}
			className='w-full h-full flex flex-col pb-24 items-center pointer-events-auto'
		>
			<div
				className='w-full h-5/6 overflow-x-auto pt-8 pb-6 flex gap-6 no-scrollbar snap-x snap-mandatory'
				ref={windowsArea}
			>
				<AnimatePresence>
					{windows.length === 0 ? (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							key='no-active'
							className='text-xl font-bold w-full text-center mt-[60%]'
						>
							No Active Apps
						</motion.p>
					) : (
						windows.map(({ id }, i) => (
							<motion.div
								exit={{ y: -100, opacity: 0 }}
								key={id}
								className={`${i === 0 && 'ml-[25%]'} ${
									i === windows.length - 1 && 'mr-[25%]'
								} w-1/2 h-full relative shrink-0 snap-center`}
							>
								<WindowJSX
									bringToFrontReq={() => {
										toggleMenu();
										bringToFrontReq(id);
									}}
								/>
							</motion.div>
						))
					)}
				</AnimatePresence>
			</div>
			<button
				type='button'
				className={`${
					windows.length === 0 && 'opacity-50'
				} p-2 outline outline-black-primary text-black-primary transition-opacity ease-steps`}
				onClick={() => deleteWindows()}
			>
				Close All
			</button>
		</motion.div>
	);
};

export default Menu;
