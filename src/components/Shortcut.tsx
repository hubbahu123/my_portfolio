import * as React from 'react';
import type { SystemObject } from '../store/types';

const Shortcut: React.FC<SystemObject> = sysObj => {
	return (
		<button
			className='group flex flex-col items-center p-2 w-full max-h-full outline-2 outline-transparent outline-offset-8 transition-all ease-steps md:p-4 md:w-24 md:h-auto md:outline hover:outline-white-primary hover:outline-offset-0 md:active:shadow-[inset_0_0_70px] active:shadow-black-primary'
			type='button'
		>
			<img
				className='w-full mb-2 select-none pointer-events-none md:mb-4'
				draggable={false}
				src={`/icons/${'ext' in sysObj ? sysObj.ext : 'folder'}.png`}
				alt='App'
				loading='eager'
				placeholder='dominantColor'
			/>
			<p className='p-2 text-center text-sm text-white-primary shadow-[inset_0_0_40px] transition-all ease-steps shadow-black-primary md:group-active:shadow-none'>
				{sysObj.name}
				{'ext' in sysObj ? `.${sysObj.ext}` : ''}
			</p>
		</button>
	);
};

export default Shortcut;
