import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import GlitchText from './GlitchText';

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
		<div
			onPointerDown={onGrab}
			className='touch-none text-white select-none cursor-grab w-full h-10 flex items-center outline outline-2 outline-white-primary'
		>
			<h3 className='grow px-1 text-center text-lg overflow-hidden whitespace-nowrap overflow-ellipsis'>
				<GlitchText onLoad decayRate={0.5}>
					Window Name
				</GlitchText>
			</h3>
			<button
				type='button'
				className='p-1 border-l-2 w-10 h-full shrink-0 select-none group hover:bg-white'
				onClick={onMaximize}
			>
				{maximized ? (
					<StaticImage
						src='../images/restore_down.png'
						alt='restore down'
						placeholder='none'
						draggable={false}
						width={36}
						className='group-hover:invert'
					/>
				) : (
					<StaticImage
						src='../images/maximize.png'
						alt='maximize'
						placeholder='none'
						draggable={false}
						width={36}
						className='group-hover:invert'
					/>
				)}
			</button>
			<button
				type='button'
				className='p-1 border-l-2 w-10 h-full shrink-0 select-none group hover:bg-white'
				onClick={onClose}
			>
				<StaticImage
					src='../images/minimize.png'
					alt='minimize'
					placeholder='none'
					draggable={false}
					width={36}
					className='group-hover:invert'
				/>
			</button>
			<button
				type='button'
				className='p-[.2rem] border-l-2 w-10 h-full shrink-0 select-none group hover:bg-white'
				onClick={onClose}
			>
				<StaticImage
					src='../images/close.png'
					alt='close'
					placeholder='none'
					draggable={false}
					width={36}
					className='group-hover:invert'
				/>
			</button>
		</div>
	);
};

export default WindowHeader;
