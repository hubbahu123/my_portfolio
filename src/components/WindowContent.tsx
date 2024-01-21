import React from 'react';
import { WindowType } from '../store/types';
import { Console } from './windows/Console';
import { FileExplorer } from './windows/FileExplorer';
import Mail from './windows/Mail';
import PDFReader from './windows/PDFReader';

interface WindowContentProps {
	type: WindowType;
}

const pickContentComponent = (type: WindowType): React.ReactNode => {
	switch (type) {
		case 'FileExplorer':
			return <FileExplorer />;
		case 'Console':
			return <Console />;
		case 'Contact':
			return <Mail />;
		case 'PDFReader':
			return <PDFReader />;
		case 'Media':
		case 'Blank':
		default:
			return <></>;
	}
};

const WindowContent: React.FC<WindowContentProps> = ({ type }) => {
	return (
		<div className="flex-1 overflow-y-auto relative flex flex-col">
			{pickContentComponent(type)}
		</div>
	);
};

export default WindowContent;
