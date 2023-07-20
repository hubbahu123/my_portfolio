import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

interface ShortcutProps {
	name: string;
}

const Shortcut: React.FC<ShortcutProps> = ({ name }) => {
	return (
		<button className='w-full max-h-full md:w-14 md:h-auto' type='button'>
			{/* Will need to be replaced with dynamic shit */}
			<StaticImage
				className='w-full h-0 pb-[100%] mb-2 select-none pointer-events-none'
				draggable={false}
				src='../../public/favicon-32x32.png'
				alt='App'
				loading='eager'
				placeholder='dominantColor'
			/>
			<p className='text-center text-sm text-white'>{name}</p>
		</button>
	);
};

export default Shortcut;
