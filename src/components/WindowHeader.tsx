import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { motion } from 'framer-motion';

interface WindowHeaderProps {
	onGrab: React.PointerEventHandler<Element>;
	onClose: React.MouseEventHandler;
	onMaximize: React.MouseEventHandler;
	maximized: boolean;
	title: string;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
	onGrab,
	onClose,
	onMaximize,
	maximized,
	title,
}) => {
	return (
		<div className="overflow-hidden">
			<motion.div
				initial={{ y: '-105%' }}
				animate={{ y: 0 }}
				transition={{ delay: 1.25, ease: 'easeOut', type: 'tween' }}
				onPointerDown={maximized ? undefined : onGrab}
				className={`touch-none text-white  w-full h-10 flex items-center border-b-2 border-white-primary ${
					!maximized && 'cursor-grab'
				}`}
			>
				<h3 className="grow px-1 text-center text-lg overflow-hidden whitespace-nowrap overflow-ellipsis select-none">
					{title}
				</h3>
				<button
					type="button"
					className="p-1 border-l-2 border-white-primary w-10 h-full shrink-0  group hover:bg-white"
					onClick={onMaximize}
				>
					{maximized ? (
						<StaticImage
							src="../images/restore_down.png"
							title="restore down"
							alt="restore down"
							placeholder="none"
							draggable={false}
							width={36}
							className="group-hover:invert"
							loading="eager"
							imgClassName="!transition-none" //Loads in slowly and looks out of place
						/>
					) : (
						<StaticImage
							src="../images/maximize.png"
							title="maximize"
							alt="maximize"
							placeholder="none"
							draggable={false}
							width={36}
							className="group-hover:invert"
							loading="eager"
							imgClassName="!transition-none"
						/>
					)}
				</button>
				<button
					type="button"
					className="p-[.2rem] border-l-2 w-10 h-full shrink-0  group hover:bg-white"
					onPointerUp={onClose}
				>
					<StaticImage
						src="../images/close.png"
						title="close"
						alt="close"
						placeholder="none"
						draggable={false}
						width={36}
						className="group-hover:invert"
						loading="eager"
						imgClassName="!transition-none"
					/>
				</button>
			</motion.div>
		</div>
	);
};

export default WindowHeader;
