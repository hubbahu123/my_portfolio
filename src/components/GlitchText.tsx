import React, { useEffect, useRef } from 'react';

interface GlitchTextProps {
	children: string;
	animated?: boolean;
	onLoad?: boolean;
	decay?: boolean;
	decayRate?: number;
}

const CHARS =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#+&%?!';
const GlitchText: React.FC<GlitchTextProps> = ({
	children,
	animated,
	onLoad,
	decay = true,
	decayRate = 1,
}) => {
	const text = useRef<HTMLSpanElement>(null);
	const interval = useRef<NodeJS.Timer>();
	const iterations = useRef(0);

	useEffect(
		() => {
			clearInterval(interval.current);

			if (animated || onLoad) {
				interval.current = setInterval(() => {
					if (!text.current) return;

					if (iterations.current > children.length) {
						clearInterval(interval.current);
						return;
					}

					text.current.textContent = children
						.split('')
						.map((_, i) =>
							decay && i < iterations.current
								? children[i]
								: CHARS[Math.floor(Math.random() * CHARS.length)]
						)
						.join('');
					iterations.current += decayRate;
				}, 30);
			} else if (text.current) {
				text.current.textContent = children;
				iterations.current = 0;
			}

			return () => clearInterval(interval.current);
		},
		onLoad ? [] : [animated]
	);

	return <span ref={text}></span>;
};

export default GlitchText;
