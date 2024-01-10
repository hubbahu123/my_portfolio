import { create } from 'zustand';
import { createWindowSlice } from './windowSlice';
import { createDirectorySlice } from './directorySlice';
import {
	DirectorySlice,
	MobileStore,
	SettingsStore,
	WindowSlice,
} from './types';
import { clamp } from 'framer-motion';
import { persist } from 'zustand/middleware';
import defaultTheme from 'tailwindcss/defaultTheme';

export const useBoundStore = create<WindowSlice & DirectorySlice>()((...a) => ({
	...createWindowSlice(...a),
	...createDirectorySlice(...a),
}));

export const useMobileStore = create<MobileStore>(set => ({
	menuOpen: false,
	windowOpen: false,
	toggleMenu: () => set(state => ({ menuOpen: !state.menuOpen })),
	home: () => set({ windowOpen: false, menuOpen: false }),
	showWindow: () => set({ windowOpen: true }),
	back: () =>
		set(state =>
			state.menuOpen ? { menuOpen: false } : { windowOpen: false }
		),
}));

const LIGHT_MODE_TEXT = [
	'Light Mode?',
	'Why?',
	'Srsly? ¿Por qué?',
	'Stop',
	'No point',
	'Nice try',
	'Next ones the real one',
	'Ha!',
	'Give up',
	'Actually',
	"It's not going to work",
	"There's literally no point",
	'Please',
	'Pleassssse',
	'UWU',
	"SORRY BUT IT JUST CAN'T HAPPEN",
	"I CAN'T DO THIS FOREVER",
	'YOU LEAVE ME NO CHOICE',
	'10',
	'9',
	'8',
	'7',
	'6',
	'5',
	'4',
	'3',
	'2',
	'2.',
	'2..',
	'2...',
	'2....',
	'2.....',
	'1',
	'LET THERE BE LIGHT',
	'Exactly what where you expecting',
	'Now ur gonna try again???',
	'Fine',
	'Light Mode',
];

export const useSettingsStore = create<
	SettingsStore,
	[['zustand/persist', SettingsStore]]
>(
	persist(
		(set, get) => ({
			brightness: 100,
			use3D: true,
			useStatic: false,
			scanlines: false,
			useFlicker: false,
			volume: 0,
			fancyText: true,
			lightModeText: LIGHT_MODE_TEXT[0],
			lightMode: false,
			setLightMode(val) {
				const nextIndex = Math.min(
					LIGHT_MODE_TEXT.indexOf(get().lightModeText) + 1,
					LIGHT_MODE_TEXT.length - 1
				);
				const nextText = LIGHT_MODE_TEXT[nextIndex];
				set({
					lightModeText: nextText,
					lightMode:
						(nextIndex === LIGHT_MODE_TEXT.length - 1 ||
							nextText === 'LET THERE BE LIGHT') &&
						val,
				});
				document.documentElement.style.filter = get().lightMode
					? 'invert(1)'
					: '';
			},
			setBrightness: val => set({ brightness: clamp(0, 100, val) }),
			set3D: val => set({ use3D: val }),
			setStatic: val => set({ useStatic: val }),
			setScanlines: val => set({ scanlines: val }),
			setFancyText: val => {
				document.documentElement.style.fontFamily = val
					? ''
					: defaultTheme.fontFamily.sans.join(',');
				set({ fancyText: val });
			},
			setFlicker: val => set({ useFlicker: val }),
			setVolume: val => set({ volume: clamp(0, 100, val) }),
			restart: () => location.reload(),
			shutdown() {
				document.documentElement.style.animation =
					'shutdown 0.5s forwards ease-in-out';
				document.documentElement.style.overflow = 'hidden';
				localStorage.setItem('introDone', 'false');
			},
		}),
		{ name: 'settings' }
	)
);
