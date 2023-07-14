import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

interface ShortcutProps {
	name: string;
}

const Shortcut: React.FC<ShortcutProps> = ({ name }) => {
	return (
		<button className='w-full' type='button'>
			{/* Will need to be replaced with dynamic shit */}
			<StaticImage
				className='w-full h-0 pb-[100%] mb-2'
				src='../../public/favicon-32x32.png'
				alt='App'
				loading='eager'
				placeholder='dominantColor'
			/>
			<p className='text-center text-sm'>{name}</p>
		</button>
	);
};

export default Shortcut;
