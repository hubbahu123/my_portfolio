import React, { useEffect, useMemo, useRef } from 'react';
import { gcd, useDebounce } from '../utils';

interface MaskProps {
	idealWidth?: number;
}

let globalCount = 0;
const Mask: React.FC<MaskProps> = ({ idealWidth = 64 }) => {
	const id = useMemo(() => `mask-${globalCount++}`, []);
	const svg = useRef<SVGSVGElement>(null);
	const [rectsData, setData] = useDebounce({ width: idealWidth, x: 10, y: 10 });

	useEffect(() => {
		const updateRects = () => {
			if (!svg.current) return;

			const svgBounds = svg.current.getBoundingClientRect();
			let width = gcd(svgBounds.width, svgBounds.height);
			if (width > idealWidth) width /= 2; //TEMP
			setData({
				width,
				x: svgBounds.width / width,
				y: svgBounds.height / width,
			});
		};
		window.addEventListener('resize', updateRects);
		window.addEventListener('orientationchange', updateRects);
		updateRects();

		return () => {
			window.removeEventListener('resize', updateRects);
			window.removeEventListener('orientationchange', updateRects);
		};
	}, []);

	return (
		<svg ref={svg} className='w-full h-full'>
			<defs>
				<mask id={id}>
					{Array(rectsData.x)
						.fill(0)
						.flatMap((_, x) =>
							Array(rectsData.y)
								.fill(0)
								.map((_, y) => {
									return (
										<rect
											width={rectsData.width}
											height={rectsData.width}
											fill={`hsl(0, 0%, ${Math.round(Math.random() * 100)})`}
										/>
									);
								})
						)}
				</mask>
			</defs>
		</svg>
	);
};

export default Mask;
