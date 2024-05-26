import { motion, useAnimate } from 'framer-motion';
import { StaticImage } from 'gatsby-plugin-image';
import React, { createContext, useEffect, useRef, useState } from 'react';
import GlitchWall from './GlitchWall';

const FRAMES = 36;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 3;
const Loader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [loaded, setLoaded] = useState(false);
	const logo = useRef<HTMLDivElement>(null);
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const playAnim = async () => {
			// Maybe add an actual load sequence sometime in the future
			if (!logo.current) return;

			logo.current.classList.add('transform-none');
			const logoImg = logo.current.firstElementChild as HTMLElement;
			logoImg.style.transform = `translateX(-${FRAMES * FRAME_WIDTH}px)`;

			await animate(0, 100, {
				duration: 6,
				ease: 'circOut',
			});
			animate(scope.current, {
				opacity: 0,
				transitionEnd: { visibility: 'hidden' },
			});
			setLoaded(true);
		};

		playAnim();
	}, []);

	return (
		<motion.div className="h-full" animate={loaded ? 'loaded' : 'unloaded'}>
			<section
				ref={scope}
				className="z-40 bg-black-primary w-full h-full fixed flex items-center justify-center flex-col"
			>
				<motion.div
					className="overflow-hidden w-64 translate-x-12 transition-transform ease-out delay-1000 duration-1000"
					ref={logo}
					initial={{ filter: 'drop-shadow(0px 0px 0px #f6019d)' }}
					animate={{ filter: 'drop-shadow(0px 0px 16px #f6019d)' }}
					transition={{
						delay: 4,
						repeat: 10,
						repeatType: 'mirror',
						ease: 'linear',
						duration: 2,
					}}
				>
					<StaticImage
						src="../images/logo/logo_large_animated.png"
						alt="Animated logo"
						layout="fixed"
						height={128}
						placeholder="none"
						className="transition-transform delay-1000"
						style={{
							transitionTimingFunction: `steps(${FRAMES})`,
							transitionDuration: `${ANIMATION_TIME}s`,
						}}
					/>
				</motion.div>
				<p className="text-light-primary">Definitely Loading...</p>
				<GlitchWall />
			</section>
			{children}
		</motion.div>
	);
};

export default Loader;
