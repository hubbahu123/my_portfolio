import React, { PointerEventHandler } from 'react';

interface WindowHeaderProps {
	onGrab: PointerEventHandler<Element>;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ onGrab }) => {
	return (
		<div
			onPointerDown={onGrab}
			className='touch-none text-white select-none cursor-grab w-full flex backdrop-blur bg-gradient-to-r from-purple-accent/75 to-dark-primary/75 from-25% to-70% outline outline-2 outline-white-primary'
		>
			<h3 className='grow text-center'>Window Name</h3>
			<button type='button'>{'<>'}</button>
			<button type='button'>-</button>
			<button type='button'>X</button>
		</div>
	);
};

export default WindowHeader;
