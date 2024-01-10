import React from 'react';
import { SystemObject } from '../store/types';

interface IconProps
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	sysObj: SystemObject;
}

const selectIcon = (sysObj: SystemObject) => {
	if (!('ext' in sysObj))
		return sysObj.name === 'Trash'
			? 'trash'
			: sysObj.children.length
			? 'folder'
			: 'folder_empty'; //Special folder
	if (!(sysObj.ext === 'exe')) return sysObj.ext;
	return sysObj.name.toLowerCase();
};

const Icon: React.FC<IconProps> = ({ sysObj, ...props }) => {
	return (
		<img
			{...props}
			draggable={false}
			src={`/icons/${selectIcon(sysObj)}.png`}
			alt={sysObj.name}
			loading="eager"
		/>
	);
};

export default Icon;
