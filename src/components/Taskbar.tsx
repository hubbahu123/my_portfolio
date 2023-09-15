import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { useContext, useEffect, useState } from 'react';
import { MobileContext } from './OS';
import GlitchText from './GlitchText';
import { useMobileStore } from '../store';
import Dropdown from './Dropdown';

const Taskbar: React.FC = () => {
	const [time, setTime] = useState('');
	const [effectsSelected, setEffectsSelected] = useState(false);
	const [audioSelected, setAudioSelected] = useState(false);
	const [timeSelected, setTimeSelected] = useState(false);

	useEffect(() => {
		const startTime = () => {
			const today = new Date();
			const h = today.getHours();
			const m = today.getMinutes();
			const s = today.getSeconds();
			setTime(`${h}:${checkTime(m)}:${checkTime(s)}`);
			setTimeout(startTime, 1000);
		};
		const checkTime = (i: number) => (i < 10 ? `0${i}` : i);
		startTime();
	}, []);

	const isMobile = useContext(MobileContext);
	const [toggleMenu, home, back] = useMobileStore(state => [
		state.toggleMenu,
		state.home,
		state.back,
	]);

	return (
		<nav className='fixed bottom-0 w-full p-4 font-bold md:top-0 md:bottom-auto md:p-0 z-40'>
			<div className='outline outline-2 outline-white-primary flex text-white backdrop-blur bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70%'>
				{isMobile ? (
					<>
						<button
							className='grow flex justify-center py-2 select-none'
							type='button'
							onClick={() => toggleMenu()}
						>
							<StaticImage
								src='../images/menu.png'
								alt='menu'
								placeholder='none'
								draggable={false}
								className='w-12 h-12'
							/>
						</button>
						<button
							className='grow flex justify-center py-2 select-none'
							type='button'
							onClick={() => home()}
						>
							<StaticImage
								src='../images/home.png'
								alt='home'
								placeholder='none'
								draggable={false}
								className='w-12 h-12'
							/>
						</button>
						<button
							className='grow flex justify-center py-2 select-none'
							type='button'
							onClick={() => back()}
						>
							<StaticImage
								src='../images/back.png'
								alt='back'
								placeholder='none'
								draggable={false}
								className='w-12 h-12'
							/>
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
								className='group-hover:invert group-active:glitch'
							/>
						</button>
						<span className='grow' />
						<button
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
							onPointerDown={() => setEffectsSelected(true)}
							onPointerOut={() => effectsSelected && setEffectsSelected(false)}
							onPointerUp={() => setEffectsSelected(false)}
						>
							<GlitchText animated={effectsSelected}>Effects</GlitchText>
						</button>
						<button
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
							onPointerDown={() => setAudioSelected(true)}
							onPointerOut={() => audioSelected && setAudioSelected(false)}
							onPointerUp={() => setAudioSelected(false)}
						>
							<GlitchText animated={audioSelected}>Audio</GlitchText>
						</button>
						<Dropdown
							className='p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary'
							type='button'
							onPointerDown={() => setTimeSelected(true)}
							onPointerOut={() => timeSelected && setTimeSelected(false)}
							onPointerUp={() => setTimeSelected(false)}
							dContent={<h1>Hey!!!!</h1>}
						>
							<GlitchText animated={timeSelected}>{time}</GlitchText>
						</Dropdown>
					</>
				)}
			</div>
		</nav>
	);
};

export default Taskbar;
