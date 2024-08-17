import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion';
import React, { memo, useEffect, useRef } from 'react';
import { Window } from '../store/types';
import WindowJSX from './Window';
import Icon from './Icon';
import { clamp } from 'three/src/math/MathUtils';

interface MenuProps {
	windows: Window[];
	deleteWindows: Function;
}

const Menu: React.FC<MenuProps> = memo(({ windows, deleteWindows }) => {
	const windowsArea = useRef<HTMLDivElement>(null);
	const scroll = useRef({ amount: 0, changed: false });

	useEffect(() => {
		if (!windowsArea.current) return;
		windowsArea.current.scrollTo(windowsArea.current.scrollWidth, 0);
	}, []);

	useAnimationFrame(() => {
		if (!scroll.current.changed) return;
		if (!windowsArea.current) return;
		scroll.current.changed = false;
		if (windowsArea.current.children.length == 1) return;
		const scrollPercent =
			scroll.current.amount /
			(windowsArea.current.scrollWidth - windowsArea.current.clientWidth);
		Array.from(windowsArea.current.children).forEach((val, i, arr) => {
			const element = val as HTMLDivElement;
			element.style.transform = `scale(${clamp(1 - Math.abs(scrollPercent - i / (arr.length - 1)) * 0.5, 0.8, 1)})`;
		});
	});

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
			className="w-full h-full flex flex-col pb-28 gap-14 items-center pointer-events-auto select-none"
		>
			<div
				className="w-full grow overflow-x-auto pt-24 flex items-center gap-4 no-scrollbar snap-x snap-mandatory"
				style={{ touchAction: 'pan-x', msTouchAction: 'pan-x' }}
				ref={windowsArea}
				onScroll={() => {
					scroll.current.amount =
						windowsArea.current?.scrollLeft ?? 0;
					scroll.current.changed = true;
				}}
			>
				<AnimatePresence>
					{windows.length === 0 ? (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							key="no-active"
							className="text-xl font-bold w-full text-center"
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
									<Icon
										sysObj={window.sysObj}
										style={{ zIndex: 999999999 }}
										className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16"
									/>
									<WindowJSX
										windowData={window}
										disableInteraction
										disableNavCompensation
									/>
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
				} p-2 outline outline-black-primary outline-2 text-black-primary transition-opacity ease-steps2`}
				onClick={() => deleteWindows()}
			>
				Close All
			</button>
		</motion.div>
	);
});

export default Menu;
