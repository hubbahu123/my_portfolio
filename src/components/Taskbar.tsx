import * as React from 'react';

const Taskbar: React.FC = () => {
	return (
		<nav
			className='fixed bottom-0 w-full p-4'
			style={{ zIndex: Number.MAX_SAFE_INTEGER }}
		>
			<div className='outline outline-white flex text-white backdrop-blur bg-gradient-to-br from-slate-900/75 to-slate-600/75'>
				<button className='grow p-4' type='button'>
					Menu
				</button>
				<button className='grow p-4 outline outline-white' type='button'>
					Home
				</button>
				<button className='grow p-4' type='button'>
					Back
				</button>
			</div>
		</nav>
	);
};

export default Taskbar;
