import { StateCreator } from 'zustand';
import type {
	WindowSlice,
	DirectorySlice,
	SystemObject,
	Window,
	WindowType,
} from './types';
import { useMobileStore, useSettingsStore } from '.';
import windowOpenAudio from '../audio/open_window.mp3';

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
	windowAudio: undefined,
	playSound(reverse = false) {
		const globalVol = useSettingsStore.getState().volume * 0.01;
		if (globalVol === 0) return;
		let audioElement = get().windowAudio;
		if (!audioElement) {
			audioElement = new Audio(windowOpenAudio);
			audioElement.playbackRate = reverse ? -1.5 : 1.5;
			audioElement.preservesPitch = !reverse;
			audioElement.volume = 0.02 * globalVol;
			set({ windowAudio: audioElement });
		}
		if (audioElement.readyState >= 3) return audioElement.play();
		audioElement.addEventListener('canplay', audioElement.play);
	},
	findWindow: (windows, ref) =>
		typeof ref === 'number'
			? windows.findIndex(window => window.id === ref)
			: windows.indexOf(ref),
	addWindow(sysObj, customID = -1, blockSound = false) {
		const type = pickWindowType(sysObj);
		let id = customID === -1 ? get().lastId : customID;
		const newWindow: Window = {
			sysObj,
			type,
			id,
		};
		useMobileStore.getState().showWindow(newWindow);
		if (!blockSound) get().playSound();
		set(state => ({
			lastId: id + 1,
			windows: [...state.windows, newWindow],
		}));
	},
	deleteWindow(ref) {
		get().playSound(true);
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
		get().addWindow(newObj, idToReuse, true);
	},
	deleteWindows() {
		set(_ => ({ windows: [] }));
	},
});
