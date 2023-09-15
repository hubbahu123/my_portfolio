import { create } from 'zustand';
import { createWindowSlice } from './windowSlice';
import { createDirectorySlice } from './directorySlice';
import { DirectorySlice, MobileStore, WindowSlice } from './types';

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
