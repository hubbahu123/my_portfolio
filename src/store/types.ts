export type SystemObject = Directory | File;
export type FileExtension = 'pdf' | 'txt' | 'png' | 'jpeg' | 'exe';
export type WindowType = 'FileExplorer' | 'Console' | 'Blank';
export type Path = string[] | string;

export interface Directory {
	name: string;
	children: SystemObject[];
	htmlElement?: HTMLElement;
}

export interface File {
	name: string;
	ext: FileExtension;
	value?: object;
	htmlElement?: HTMLElement;
}

export interface Window {
	id: number;
	sysObj: SystemObject;
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
	traverse(target: SystemObject, startDir?: Directory): Directory[] | null;
}

export interface MobileStore {
	menuOpen: boolean;
	windowOpen: boolean;
	toggleMenu: Function;
	home: Function;
	showWindow: Function;
	back: Function;
}

export interface SettingsStore {
	brightness: number;
	use3D: boolean;
	useStatic: boolean;
	scanlines: boolean;
	fancyText: boolean;
	volume: number;
	setBrightness(val: number): void;
	set3D(val: boolean): void;
	setStatic(val: boolean): void;
	setScanlines(val: boolean): void;
	setFancyText(val: boolean): void;
	setVolume(val: number): void;
	restart: Function;
	shutdown: Function;
}
