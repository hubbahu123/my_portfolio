import { StateCreator } from 'zustand';
import type {
	WindowSlice,
	DirectorySlice,
	SystemObject,
	Window,
	WindowType,
} from './types';
import { useMobileStore } from '.';

const pickWindowType = (sysObj: SystemObject): WindowType => {
	if (!('ext' in sysObj)) return 'FileExplorer';
	switch (sysObj.ext) {
		case 'exe':
			if (sysObj.name === 'Console') return 'Console';
			if (sysObj.name === 'Contact') return 'Contact';
		case 'png':
		case 'mp4':
			return 'MediaViewer';
		case 'pdf':
			return 'PDFReader';
		case 'txt':
			return 'TextEditor';
		case 'mys':
			return 'Virus';
		default:
			return 'Blank';
	}
};

export const createWindowSlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	WindowSlice
> = (set, get) => ({
	windows: [],
	lastId: 0,
	findWindow: (windows, ref) =>
		typeof ref === 'number'
			? windows.findIndex(window => window.id === ref)
			: windows.indexOf(ref),
	addWindow(sysObj, customID = -1) {
		const type = pickWindowType(sysObj);
		let id = customID === -1 ? get().lastId : customID;
		const newWindow: Window = {
			sysObj,
			type,
			id,
		};
		useMobileStore.getState().showWindow(newWindow);

		set(state => ({
			lastId: id + 1,
			windows: [...state.windows, newWindow],
		}));
	},
	deleteWindow(ref) {
		set(state => {
			const windows = [...state.windows];
			windows.splice(get().findWindow(windows, ref));
			return { windows };
		});
	},
	replaceWindow(oldWindow, newObj) {
		get().deleteWindow(oldWindow);
		const idToReuse =
			typeof oldWindow === 'number' ? oldWindow : oldWindow.id;
		get().addWindow(newObj, idToReuse);
	},
	deleteWindows() {
		set(_ => ({ windows: [] }));
	},
});
