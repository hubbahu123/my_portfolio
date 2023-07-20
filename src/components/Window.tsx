import { Point, motion, useDragControls, useMotionValue } from 'framer-motion';
import * as React from 'react';
import Resizers from './Resizers';
import { useRef, useState, useEffect } from 'react';
import WindowHeader from './WindowHeader';

interface Dimensions {
	w: number;
	h: number;
}

interface WindowProps {
	area: React.RefObject<Element>;
	bringToFrontRequest: React.PointerEventHandler;
	zIndex: number;
	initialLocation?: Point;
	initialDimensions?: Dimensions;
	minDimensions?: Dimensions;
}

const Window: React.FC<WindowProps> = ({
	area,
	bringToFrontRequest,
	zIndex = 1,
	initialLocation = { x: 0, y: 0 },
	initialDimensions = { w: 500, h: 300 },
	minDimensions = { w: 200, h: 100 },
}) => {
	const [isMoving, setIsMoving] = useState(false);
	const width = useMotionValue(initialDimensions.w);
	const height = useMotionValue(initialDimensions.h);
	const x = useMotionValue(initialLocation.x);
	const y = useMotionValue(initialLocation.y);
	const controls = useDragControls();
	const windowRef = useRef<HTMLDivElement>(null);

	return (
		<motion.div
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
			onPointerDown={bringToFrontRequest}
			ref={windowRef}
			className={`absolute outline outline-white flex flex-col max-w-full max-h-full top-0 ${
				isMoving && 'invisible'
			}`}
			style={{
				minWidth: minDimensions.w,
				minHeight: minDimensions.h,
				x,
				y,
				width,
				height,
				zIndex,
			}}
		>
			<WindowHeader onGrab={e => controls.start(e)} />
			<div className='grow bg-black'></div>
			<Resizers
				onResizeStart={() => {
					setIsMoving(true);
				}}
				onResizeEnd={() => {
					setIsMoving(false);
				}}
				onResize={(info, cardinal) => {
					switch (cardinal) {
						case 'nw':
							x.set(x.get() + info.delta.x);
							width.set(width.get() - info.delta.x);
						case 'n':
							y.set(y.get() + info.delta.y);
							height.set(height.get() - info.delta.y);
							break;
						case 'ne':
							y.set(y.get() + info.delta.y);
							height.set(height.get() - info.delta.y);
						case 'e':
							width.set(width.get() + info.delta.x);
							break;
						case 'se':
							width.set(width.get() + info.delta.x);
						case 's':
							height.set(height.get() + info.delta.y);
							break;
						case 'sw':
							height.set(height.get() + info.delta.y);
						case 'w':
							x.set(x.get() + info.delta.x);
							width.set(width.get() - info.delta.x);
							break;
					}
				}}
			/>
		</motion.div>
	);
};

export default Window;
