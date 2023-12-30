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

export const useSettingsStore = create<
	SettingsStore,
	[['zustand/persist', SettingsStore]]
>(
	persist(
		set => ({
			brightness: 100,
			use3D: true,
			useStatic: false,
			scanlines: false,
			volume: 0,
			setBrightness: val => set({ brightness: clamp(0, 100, val) }),
			set3D: val => set({ use3D: val }),
			setStatic: val => set({ useStatic: val }),
			setScanlines: val => set({ scanlines: val }),
			setVolume: val => set({ volume: clamp(0, 100, val) }),
			restart() {},
			shutdown() {},
		}),
		{ name: 'settings' }
	)
);
