import { useState, useEffect, useRef } from 'react';

export const mod = (x: number, y: number) => ((x % y) + y) % y;

export const randRange = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export const gcd = (x: number, y: number) => {
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
};

const CHARS =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#+&%?!';
export const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

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

export function usePersistent<type extends Object>(
	key: string,
	initialState: type,
	conversion: (str: string) => type
): [type, React.Dispatch<React.SetStateAction<type>>, Function] {
	let actualInitial: string | null = localStorage.getItem(key);
	const [value, setVal] = useState(
		actualInitial === null ? initialState : conversion(actualInitial)
	);

	useEffect(() => localStorage.setItem(key, value.toString()), [value]);
	const clear = () => localStorage.removeItem(key);

	return [value, setVal, clear];
}

export function useDebounce<type>(
	initialState: type,
	delay = 3000
): [type, React.Dispatch<React.SetStateAction<type>>] {
	const [state, dispatch] = useState(initialState);
	const timeout = useRef<NodeJS.Timeout>();
	const debouncedDispatch: React.Dispatch<React.SetStateAction<type>> = (
		...props
	) => {
		clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			dispatch(...props);
		}, delay);
	};
	return [state, debouncedDispatch];
}

export const colors = {
	blueAccent: '#023788',
	purpleAccent: '#650d89',
	burgundyAccent: '#920075',
	pinkAccent: '#f6019d',
	yellowAccent: '#f9c80e',
	blackPrimary: '#1f0728',
	darkPrimary: '#353c45',
	lightPrimary: '#6e83a1',
	whitePrimary: '#f5f9ff',
	purpleWatermark: '#291632',
};
