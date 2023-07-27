import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) setMatches(media.matches);

		const listener = () => setMatches(media.matches);

		media.addEventListener('change', listener);

		return () => media.removeEventListener('change', listener);
	}, [query]);

	return matches;
};

export const useBreakpointSM = () => useMediaQuery('(min-width: 640px)');
export const useBreakpointMD = () => useMediaQuery('(min-width: 768px)');
export const useBreakpointLG = () => useMediaQuery('(min-width: 1024px)');
export const useBreakpointXL = () => useMediaQuery('(min-width: 1280px)');
export const useBreakpoint2XL = () => useMediaQuery('(min-width: 1536px)');

// export const mod = (x: number, y: number) => ((x % y) + y) % y;
