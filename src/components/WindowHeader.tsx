import React, { PointerEventHandler } from 'react';

interface WindowHeaderProps {
	onGrab: PointerEventHandler<Element>;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ onGrab }) => {
	return (
		<div
			onPointerDown={onGrab}
			className='touch-none text-white select-none cursor-grab w-full flex backdrop-blur bg-gradient-to-br from-slate-900/75 to-slate-600/75 outline outline-white'
		>
			<h3 className='grow text-center'>Window Name</h3>
			<button type='button'>{'<>'}</button>
			<button type='button'>-</button>
			<button type='button'>X</button>
		</div>
	);
};

export default WindowHeader;
