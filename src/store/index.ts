import { create, StateCreator } from 'zustand';
import InitialSystem from '../content/InitialSystem';
import type {
	WindowData,
	Window,
	Directory,
	SystemObject,
	Path,
} from './types';

interface WindowSlice {
	windows: Window[];
	findWindow(windows: Window[], ref: number | Window): number;
	addWindow(window: WindowData): void;
	deleteWindow(ref: number | Window): void;
	bringToFront(ref: number | Window): void;
}

interface DirectorySlice {
	rootDir: Directory;
	navigateFrom(startDir: Directory, path: Path): SystemObject | undefined;
	navigate(path: Path): SystemObject | undefined;
	move(target: Path, dir: Directory | Path): boolean;
}

const createWindowSlice: StateCreator<
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
	addWindow() {
		set(state => ({
			windows: [
				{
					id: state.windows.reduce(
						(prev, current) => Math.max(prev, current.id),
						0
					), // Get the next open id value starting from 0
				},
				...state.windows,
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
	bringToFront(ref) {
		const windows = [...get().windows];
		const index = get().findWindow(windows, ref);
		if (index === windows.length - 1) return; //Already in front
		windows.push(...windows.splice(index, 1));
		set(_ => ({ windows }));
	},
});

const createDirectorySlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	DirectorySlice
> = (set, get) => ({
	rootDir: { name: 'root', children: [InitialSystem] },
	navigateFrom(startDir, path) {
		//Convert path to usuable list
		path =
			typeof path === 'string'
				? path.split('/')
				: path.flatMap(place => place.split('/'));

		// Get extension for extra checks
		let last = path[path.length - 1];
		const extensionIndex = last.lastIndexOf('.');
		let extension: null | string = null;
		if (extensionIndex > -1) {
			path[path.length - 1] = last.slice(0, extensionIndex);
			extension = last.slice(extensionIndex + 1, last.length);
		}

		let current = startDir;
		for (let i = 0; i < path.length; i++) {
			const next = path[i];
			const isLast = i === path.length - 1;
			let temp = current.children.find(obj => {
				if (isLast && extension !== null) {
					if (!('extension' in obj)) return false;
					return next === obj.name && extension === obj.extension;
				}
				return next === obj.name;
			});

			if (isLast) return temp;
			if (!temp || !('children' in temp)) return undefined;
			current = temp;
		}
	},
	navigate: (path: Path) => get().navigateFrom(get().rootDir, path),
	move(target, dir) {
		return false;
	},
});

// ------------------------------------------- Store -------------------------------------------

export const useBoundStore = create<WindowSlice & DirectorySlice>()((...a) => ({
	...createWindowSlice(...a),
	...createDirectorySlice(...a),
}));
