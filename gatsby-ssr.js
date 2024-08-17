import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
	setHeadComponents([
		<link
			rel="preload"
			href="/fonts/retro_font.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
			key="retroFont"
		/>,
		<link
			rel="preload"
			href="/fonts/retro_font_bold.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
			key="retroFont"
		/>,
		<link
			rel="preload"
			href="/fonts/retro_font_fancy.woff2"
			as="font"
			type="font/otf"
			crossOrigin="anonymous"
			key="retroFont"
		/>,
	]);
};
