import { StateCreator } from 'zustand';
import type {
	WindowSlice,
	DirectorySlice,
	SystemObject,
	WindowType,
} from './types';
import { useMobileStore } from '.';

const pickWindowType = (sysObj: SystemObject): WindowType => {
	if (!('ext' in sysObj)) return 'FileExplorer';
	if (sysObj.ext === 'exe') {
		if (sysObj.name === 'Console') return 'Console';
	}
	return 'Blank';
};

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
		useMobileStore.getState().showWindow();
		const type = pickWindowType(sysObj);

		set(state => ({
			windows: [
				...state.windows,
				{
					sysObj,
					type,
					id:
						state.windows.reduce(
							(prev, current) => Math.max(prev, current.id),
							-1
						) + 1, // Get the next open id value starting from 0
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
		useMobileStore.getState().showWindow();

		const windows = [...get().windows];
		const index = get().findWindow(windows, ref);
		if (index === windows.length - 1) return; //Already in front
		windows.push(...windows.splice(index, 1));
		set(_ => ({ windows }));
	},
});
