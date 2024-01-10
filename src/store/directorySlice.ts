import { StateCreator } from 'zustand';
import InitialSystem from '../content/InitialSystem';
import type { WindowSlice, DirectorySlice, SystemObject } from './types';

export const createDirectorySlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	DirectorySlice
> = (set, get) => ({
	rootDir: { name: 'C:', children: [InitialSystem] },
	toPath(path) {
		return typeof path === 'string'
			? path.split('/')
			: path.flatMap(place => place.split('/'));
	},
	navigateFrom(startDir, path) {
		//Convert path to usuable list
		path = get().toPath(path);

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
	navigate: path => {
		path = get().toPath(path);
		if (path[0] === 'C:') path.shift();
		return get().navigateFrom(get().rootDir, path);
	},
	move(target, dir) {
		return false;
	},
	traverse(target, startDir) {
		//Start at rootDir
		if (!startDir) startDir = get().rootDir;

		const parents = [startDir];
		const found = startDir.children.find(child => {
			if (child.name === target.name) return true;
			if (!('children' in child)) return false;
			const potentialParents = get().traverse(target, child);
			if (!potentialParents) return false;
			parents.push(...potentialParents);
			return true;
		});
		return found ? parents : null;
	},
	emptyDir(target) {
		const path = get().toPath(target);
		if (path[0] === get().rootDir.name) path.shift();

		const modifiedSystem = { ...get().rootDir };
		let currentDir: SystemObject | undefined = modifiedSystem;
		for (let i = 0; i < path.length; i++) {
			if (!('children' in currentDir)) return;
			currentDir = currentDir.children.find(
				child => child.name === path[i]
			);
			if (!currentDir || !('children' in currentDir)) return;
		}
		currentDir.children = [];
		set({ rootDir: modifiedSystem });
	},
});
