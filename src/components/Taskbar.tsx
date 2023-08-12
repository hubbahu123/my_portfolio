import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { useContext } from 'react';
import { MobileContext } from './OS';

const Taskbar: React.FC = () => {
	const isMobile = useContext(MobileContext);
	return (
		<nav
			className='fixed bottom-0 w-full p-4 font-bold md:top-0 md:bottom-auto md:p-0'
			style={{ zIndex: Number.MAX_SAFE_INTEGER }}
		>
			<div className='outline outline-2 outline-white-primary flex text-white backdrop-blur bg-gradient-to-r from-purple-accent/75 to-dark-primary/75 from-25% to-70%'>
				{isMobile ? (
					<>
						<button className='grow p-4' type='button'>
							Menu
						</button>
						<button
							className='grow p-4 outline outline-2 outline-white-primary'
							type='button'
						>
							Home
						</button>
						<button className='grow p-4' type='button'>
							Back
						</button>
					</>
				) : (
					<>
						<button
							className='group px-4 transition-colors ease-steps hover:bg-white-primary'
							type='button'
						>
							<StaticImage
								src='../images/logo/logo_plain.png'
								alt='Start Button'
								width={28}
								className='group-hover:invert'
							/>
						</button>
						<span className='grow' />
						<button
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
						>
							Effects
						</button>
						<button
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
						>
							Audio
						</button>
						<button
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
						>
							12:20:20 PM
						</button>
					</>
				)}
			</div>
		</nav>
	);
};

export default Taskbar;
