import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { motion } from 'framer-motion';

interface WindowHeaderProps {
	onGrab: React.PointerEventHandler<Element>;
	onClose: React.MouseEventHandler;
	onMaximize: React.MouseEventHandler;
	maximized: boolean;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
	onGrab,
	onClose,
	onMaximize,
	maximized,
}) => {
	return (
		<div className="overflow-hidden pb-0.5">
			<motion.div
				initial={{ y: '-105%' }}
				animate={{ y: 0 }}
				transition={{ delay: 1.25, ease: 'easeOut', type: 'tween' }}
				onPointerDown={onGrab}
				className="touch-none text-white select-none cursor-grab w-full h-10 flex items-center outline outline-2 outline-white-primary"
			>
				<h3 className="grow px-1 text-center text-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
					Window Name
				</h3>
				<button
					type="button"
					className="p-1 border-l-2 w-10 h-full shrink-0 select-none group hover:bg-white"
					onClick={onMaximize}
				>
					{maximized ? (
						<StaticImage
							src="../images/restore_down.png"
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
					className="p-[.2rem] border-l-2 w-10 h-full shrink-0 select-none group hover:bg-white"
					onClick={onClose}
				>
					<StaticImage
						src="../images/close.png"
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
