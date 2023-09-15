import React from 'react';
import { SystemObject } from '../store/types';

interface IconProps
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	sysObj: SystemObject;
}

const Icon: React.FC<IconProps> = ({ sysObj, ...props }) => {
	return (
		<img
			{...props}
			draggable={false}
			src={`/icons/${'ext' in sysObj ? sysObj.ext : 'folder'}.png`}
			alt={sysObj.name}
			loading='eager'
			placeholder='dominantColor'
		/>
	);
};

export default Icon;
