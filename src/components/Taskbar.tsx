import * as React from 'react';

const Taskbar: React.FC = () => {
	return (
		<nav className='fixed bottom-0 w-full p-8'>
			<div className='border flex text-white bg-black'>
				<button className='border-r grow p-4' type='button'>
					Menu
				</button>
				<button className='grow p-4' type='button'>
					Home
				</button>
				<button className='border-l grow p-4' type='button'>
					Back
				</button>
			</div>
		</nav>
	);
};

export default Taskbar;
