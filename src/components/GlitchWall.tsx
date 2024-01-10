import React, { useEffect, useMemo, useRef } from 'react';
import { randomChar } from '../utils';

const GlitchWall: React.FC<{ duration?: number }> = ({ duration = 6000 }) => {
	const mask = 'radial-gradient(circle, transparent 128px, white 256px)';
	const textRef = useRef<HTMLParagraphElement>(null);

	//Doesn't create a new array every frame now
	const array = useMemo(() => Array.from(Array(4000)), []);
	useEffect(() => {
		const interval = setInterval(() => {
			if (!textRef.current) return;
			textRef.current.textContent = array
				.map(randomChar)
				.join('')
				.replaceAll('f', ' full-stack developer ');
		}, 60);

		let timeout: NodeJS.Timeout;
		if (duration !== Infinity)
			timeout = setTimeout(() => clearInterval(interval), duration);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, []);

	return (
		<p
			className="pointer-events-none w-full top-1/2 h-full -translate-y-1/2 absolute -z-10 break-all text-center text-3xl text-purple-watermark opacity-40"
			style={{ mask, WebkitMask: mask }}
			ref={textRef}
		/>
	);
};

export default GlitchWall;
