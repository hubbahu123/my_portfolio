import React, { useContext, useEffect } from 'react';
import { WindowDataContext } from '../Window';

const MediaViewer = () => {
	const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
	if (!sysObj || !('ext' in sysObj) || !sysObj.value) return null;
	useEffect(() => {
		if (setTitle && sysObj)
			setTitle(`${sysObj.name}.${sysObj.ext} - Media Viewer`);
	}, [setTitle]);

	return <div></div>;
};

export default MediaViewer;
