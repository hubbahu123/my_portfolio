import { Point, motion, useDragControls, useMotionValue } from 'framer-motion';
import * as React from 'react';
import Resizers from './Resizers';
import { useRef, useState, useEffect, useContext } from 'react';
import WindowHeader from './WindowHeader';
import { MobileContext } from './OS';

interface Dimensions {
	w: number;
	h: number;
}

interface WindowProps {
	area?: React.RefObject<Element>;
	bringToFrontReq?: React.PointerEventHandler;
	deleteReq?: Function;
	initialLocation?: Point;
	initialDimensions?: Dimensions;
	minDimensions?: Dimensions;
}

const Window: React.FC<WindowProps> = ({
	area,
	bringToFrontReq,
	deleteReq,
	initialLocation = { x: 0, y: 0 },
	initialDimensions = { w: 500, h: 300 },
	minDimensions = { w: 200, h: 100 },
}) => {
	const [isMoving, setIsMoving] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const width = useMotionValue(initialDimensions.w);
	const height = useMotionValue(initialDimensions.h);
	const x = useMotionValue(initialLocation.x);
	const y = useMotionValue(initialLocation.y);
	const controls = useDragControls();
	const windowRef = useRef<HTMLDivElement>(null);
	const isMobile = useContext(MobileContext);

	return (
		<motion.section
			drag
			dragListener={false}
			dragControls={controls}
			dragConstraints={area}
			dragElastic={0.2}
			dragTransition={{ power: 0.2, timeConstant: 200 }}
			onDragStart={() => {
				setIsMoving(true);
				document.documentElement.classList.add('cursor-grab');
				document.body.classList.add('pointer-events-none');
			}}
			onDragEnd={() => {
				setIsMoving(false);
				document.documentElement.classList.remove('cursor-grab');
				document.body.classList.remove('pointer-events-none');
			}}
			initial={isMobile ? {} : { scale: 0 }}
			animate={isMobile ? {} : { scale: 1 }}
			exit={isMobile ? {} : { scale: 0 }}
			onPointerDown={bringToFrontReq}
			ref={windowRef}
			className={`${
				(isMobile || maximized) && '!w-full !h-full !transform-none'
			} pointer-events-auto absolute outline backdrop-blur bg-black-primary from-black-primary/75 to-dark-primary/75 from-25% to-70% outline-2 outline-white-primary flex flex-col max-w-full max-h-full top-0 shadow-[10px_10px_0_0] shadow-black-primary/25 md:bg-gradient-to-r md:bg-transparent ${
				isMoving && 'invisible backdrop-blur-none'
			}`}
			style={{
				minWidth: minDimensions.w,
				minHeight: minDimensions.h,
				x,
				y,
				width,
				height,
			}}
		>
			{!isMobile && (
				<WindowHeader
					onGrab={e => controls.start(e)}
					onClose={() => deleteReq && deleteReq()}
					onMaximize={() => setMaximized(maximized => !maximized)}
					maximized={maximized}
				/>
			)}
			<div className='grow overflow-y-auto'></div>
			{!isMobile && (
				<Resizers
					onResizeStart={() => setIsMoving(true)}
					onResizeEnd={() => setIsMoving(false)}
					onResize={({ delta }, cardinal) => {
						const westResize = () => {
							//Prevents negative dragging
							const w = width.get();
							let newWidth = w - delta.x;
							let newX = delta.x;
							if (newWidth < minDimensions.w) {
								newWidth = minDimensions.w;
								newX = w - newWidth;
							}

							x.set(x.get() + newX);
							width.set(newWidth);
						};

						const northResize = () => {
							//Prevents negative dragging
							const h = height.get();
							let newHeight = h - delta.y;
							let newY = delta.y;
							if (newHeight < minDimensions.h) {
								newHeight = minDimensions.h;
								newY = h - newHeight;
							}

							y.set(y.get() + newY);
							height.set(newHeight);
						};

						switch (cardinal) {
							case 'nw':
								westResize();
							case 'n':
								northResize();
								break;
							case 'ne':
								y.set(y.get() + delta.y);
								height.set(height.get() - delta.y);
							case 'e':
								width.set(width.get() + delta.x);
								break;
							case 'se':
								width.set(width.get() + delta.x);
							case 's':
								height.set(height.get() + delta.y);
								break;
							case 'sw':
								height.set(height.get() + delta.y);
							case 'w':
								westResize();
								break;
						}
					}}
					showOutline={isMoving}
				/>
			)}
		</motion.section>
	);
};

export default Window;
