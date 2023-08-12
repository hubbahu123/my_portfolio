export interface WindowData {}

export interface Window extends WindowData {
	id: number;
}

export interface File {
	name: string;
	extension: 'pdf' | 'txt' | 'png' | 'jpeg' | 'exe';
	shortcut?: boolean;
}

export interface Directory {
	name: string;
	children: SystemObject[];
}

export type SystemObject = Directory | File;

export type Path = string[] | string;
