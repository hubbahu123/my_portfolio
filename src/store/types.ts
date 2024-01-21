export type SystemObject = Directory | File;
export type FileExtension =
	| 'pdf'
	| 'txt'
	| 'png'
	| 'jpeg'
	| 'mp4'
	| 'exe'
	| 'mys';
export type WindowType =
	| 'FileExplorer'
	| 'Console'
	| 'Contact'
	| 'PDFReader'
	| 'Text Editor'
	| 'Media'
	| 'Blank';
export type Path = string[];

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
	toPath(path: Path | string): Path;
	navigateFrom(
		startDir: Directory,
		path: Path | string
	): SystemObject | undefined;
	navigate(path: Path | string): SystemObject | undefined;
	move(target: Path | string, dir: Directory | Path): boolean;
	traverse(target: SystemObject, startDir?: Directory): Directory[] | null;
	emptyDir(target: Path | string): void;
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
	useFlicker: boolean;
	scanlines: boolean;
	fancyText: boolean;
	volume: number;
	lightModeText: string;
	lightMode: boolean;
	fullscreen: boolean;
	setBrightness(val: number): void;
	set3D(val: boolean): void;
	setStatic(val: boolean): void;
	setScanlines(val: boolean): void;
	setFancyText(val: boolean): void;
	setFlicker(val: boolean): void;
	setVolume(val: number): void;
	setLightMode(val: boolean): void;
	setFullscreen(val: boolean): void;
	initFullscreen: Function;
	restart: Function;
	shutdown: Function;
}
