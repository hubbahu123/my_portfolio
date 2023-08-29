import { StateCreator } from 'zustand';
import InitialSystem from '../content/InitialSystem';
import type { Path, WindowSlice, DirectorySlice } from './types';

export const createDirectorySlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	DirectorySlice
> = (_set, get) => ({
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
					if (!('ext' in obj)) return false;
					return next === obj.name && extension === obj.ext;
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
