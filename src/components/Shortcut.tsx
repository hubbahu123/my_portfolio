import * as React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import type { SystemObject } from '../store/types';

const Shortcut: React.FC<SystemObject> = sysObj => {
	return (
		<button
			className='flex justify-center p-2 w-full max-h-full outline-2 outline-transparent outline-offset-8 transition-all ease-steps md:p-4 md:w-24 md:h-auto md:outline hover:outline-white-primary hover:outline-offset-0'
			type='button'
		>
			{/* <GatsbyImage alt={`${sysObj.name} ${'extension' in sysObj ? 'App' : 'Folder'}`} image={} /> */}
			{/* <StaticImage
				className='w-full h-0 pb-[100%] mb-2 select-none pointer-events-none md:mb-4'
				draggable={false}
				src='../../public/favicon-32x32.png'
				alt='App'
				loading='eager'
				placeholder='dominantColor'
			/> */}
			<p className='p-2 text-center text-sm text-white shadow-[inset_0_0_40px] shadow-black-primary'>
				{sysObj.name}
				{'extension' in sysObj ? `.${sysObj.extension}` : ''}
			</p>
		</button>
	);
};

export default Shortcut;
