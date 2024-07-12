import React from 'react';
import { WindowType } from '../store/types';
import { Console } from './windows/Console';
import { FileExplorer } from './windows/FileExplorer';
import Mail from './windows/Mail';
import PDFReader from './windows/PDFReader';
import MediaViewer from './windows/MediaViewer';
import Virus from './windows/Virus';
import TextEditor from './windows/TextEditor';

interface WindowContentProps {
	type: WindowType;
	basicWindow: boolean;
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
		case 'MediaViewer':
			return <MediaViewer />;
		case 'TextEditor':
			return <TextEditor />;
		case 'Virus':
			return <Virus />;
		case 'Blank':
		default:
			return null;
	}
};

const WindowContent: React.FC<WindowContentProps> = ({ type, basicWindow }) => {
	return (
		<div
			className={
				basicWindow
					? 'relative flex-1 overflow-hidden'
					: 'relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'
			}
		>
			{pickContentComponent(type)}
		</div>
	);
};
export default WindowContent;
