import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { Window } from '../store/types';
import WindowJSX from './Window';
import Icon from './Icon';

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
	}, []);

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
			className="w-full h-full flex flex-col pb-24 items-center pointer-events-auto select-none"
		>
			<div
				className="w-full h-5/6 overflow-x-auto pt-20 pb-6 flex gap-4 no-scrollbar snap-x snap-mandatory"
				style={{ perspective: '1000' }}
				ref={windowsArea}
			>
				<AnimatePresence>
					{windows.length === 0 ? (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							key="no-active"
							className="text-xl font-bold w-full text-center mt-[40%]"
						>
							No Active Apps
						</motion.p>
					) : (
						windows.map((window, i) => {
							return (
								<motion.div
									key={window.id}
									exit={{ y: -100, opacity: 0 }}
									className={`${i === 0 && 'ml-[25%]'} ${
										i === windows.length - 1 && 'mr-[25%]'
									} w-3/5 h-full relative shrink-0 snap-center`}
								>
									<motion.div
										className="w-full h-full"
										initial={{ scale: 0.75 }}
										whileInView={{ scale: 1 }}
										viewport={{
											root: windowsArea,
											amount: 'all',
											margin: '10px',
										}}
									>
										<Icon
											sysObj={window.sysObj}
											className="absolute z-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16"
										/>
										<WindowJSX
											bringToFrontReq={() => {
												toggleMenu();
												bringToFrontReq(window.id);
											}}
											{...window}
										/>
									</motion.div>
								</motion.div>
							);
						})
					)}
				</AnimatePresence>
			</div>
			<button
				type="button"
				className={`${
					windows.length === 0 && 'opacity-50 cursor-not-allowed'
				} p-2 outline outline-black-primary outline-2 text-black-primary transition-opacity ease-steps`}
				onClick={() => deleteWindows()}
			>
				Close All
			</button>
		</motion.div>
	);
};

export default Menu;
