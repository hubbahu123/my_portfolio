import React, { useEffect, useRef } from 'react';
import { randomChar } from '../utils';

interface GlitchTextProps {
	children: string;
	animated?: boolean;
	onLoad?: boolean | number;
	decay?: boolean;
	decayRate?: number;
}

const GlitchText: React.FC<GlitchTextProps> = ({
	children,
	animated,
	onLoad = false,
	decay = true,
	decayRate = 1,
}) => {
	const text = useRef<HTMLSpanElement>(null);
	const interval = useRef<NodeJS.Timer>();
	const iterations = useRef(0);

	useEffect(
		() => {
			clearInterval(interval.current);
			const begin = () => {
				interval.current = setInterval(() => {
					if (!text.current) return;

					if (iterations.current > children.length) {
						clearInterval(interval.current);
						return;
					}

					text.current.textContent = children
						.split('')
						.map((_, i) =>
							decay && i < iterations.current ? children[i] : randomChar()
						)
						.join('');
					iterations.current += decayRate;
				}, 30);
			};

			if (animated || onLoad) {
				if (typeof onLoad === 'number') setTimeout(begin, onLoad);
				else begin();
			} else if (text.current) {
				text.current.textContent = children;
				iterations.current = 0;
			}

			return () => clearInterval(interval.current);
		},
		onLoad ? [] : [animated]
	);

	return <span ref={text}>{children}</span>;
};

export default GlitchText;
