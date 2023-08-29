export type SystemObject = Directory | File;
export type FileExtension = 'pdf' | 'txt' | 'png' | 'jpeg' | 'exe';
export type WindowType = 'FileExplorer' | 'Console';
export type Path = string[] | string;

export interface Directory {
	name: string;
	children: SystemObject[];
}

export interface File {
	name: string;
	ext: FileExtension;
	value?: object;
}
export interface Window {
	sysObj: SystemObject;
	name: string;
	id: number;
	type: WindowType;
}

export interface WindowSlice {
	windows: Window[];
	findWindow(windows: Window[], ref: number | Window): number;
	addWindow(sysObj: SystemObject): void;
	deleteWindow(ref: number | Window): void;
	deleteWindows(): void;
	bringToFront(ref: number | Window): void;
}

export interface DirectorySlice {
	rootDir: Directory;
	navigateFrom(startDir: Directory, path: Path): SystemObject | undefined;
	navigate(path: Path): SystemObject | undefined;
	move(target: Path, dir: Directory | Path): boolean;
}

export interface MobileStore {
	menuOpen: boolean;
	toggleMenu: Function;
}
