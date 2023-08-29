import { StateCreator } from 'zustand';
import type { WindowSlice, DirectorySlice, WindowType } from './types';

// function FileToWindow(): [string, WindowType] {
// }

export const createWindowSlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	WindowSlice
> = (set, get) => ({
	windows: [],
	findWindow: (windows, ref) =>
		typeof ref === 'number'
			? windows.findIndex(window => window.id === ref)
			: windows.indexOf(ref),
	addWindow(sysObj) {
		set(state => ({
			windows: [
				...state.windows,
				{
					name:
						!('ext' in sysObj) || sysObj.ext === 'exe'
							? sysObj.name
							: sysObj.name + sysObj.ext,
					sysObj,
					id:
						state.windows.reduce(
							(prev, current) => Math.max(prev, current.id),
							-1
						) + 1, // Get the next open id value starting from 0
					type: 'FileExplorer',
				},
			],
		}));
	},
	deleteWindow(ref) {
		set(state => {
			const windows = [...state.windows];
			windows.splice(get().findWindow(windows, ref));
			return { windows };
		});
	},
	deleteWindows() {
		set(_ => ({ windows: [] }));
	},
	bringToFront(ref) {
		const windows = [...get().windows];
		const index = get().findWindow(windows, ref);
		if (index === windows.length - 1) return; //Already in front
		windows.push(...windows.splice(index, 1));
		set(_ => ({ windows }));
	},
});
