import React, { memo, useEffect, useRef, useState } from 'react';
import { useSiteMetadata } from '../utils';

interface SEOProps {
	description?: 'string';
	pathname?: 'string';
	children?: React.ReactNode;
}

const GetFrames = (text: string, shown: number): string[] => {
	const charArray = Array.from(text);
	return charArray.map((_, i) => {
		let frame = charArray.slice(i, i + shown).join('');
		if (frame.length < shown)
			frame += charArray.slice(0, shown - frame.length).join(''); //Wraps around if needed
		return frame;
	});
};

//Add some held frames
const FRAMES = [
	...Array(6).fill('-----RedaOS-----'),
	...GetFrames(
		'-----RedaOS---------------💻---------------👾-----',
		16
	).reverse(),
];

export const SEO: React.FC<SEOProps> = memo(
	({ description, pathname, children }) => {
		const {
			title,
			description: defaultDescription,
			image,
			siteUrl,
			twitterUsername,
		} = useSiteMetadata();

		const seo = {
			title: title || 'RedaOS',
			description: description || defaultDescription,
			image: `${siteUrl}${image}`,
			url: `${siteUrl}${pathname || ``}`,
			twitterUsername,
		};

		const titleRef = useRef<HTMLTitleElement>(null);
		const titleInfo = useRef({ i: -1, focused: true });
		useEffect(() => {
			const updateFrame = () => {
				if (!titleRef.current) return;
				if (!titleInfo.current.focused)
					return (titleRef.current.textContent =
						'Where are you going 🥺');
				titleInfo.current.i = (titleInfo.current.i + 1) % FRAMES.length;
				titleRef.current.textContent =
					FRAMES[titleInfo.current.i] || 'RedaOS';
			};
			updateFrame();
			const intervalID = setInterval(updateFrame, 250);

			const focusHandler = () => {
				titleInfo.current.focused = true;
				updateFrame();
			};
			const blurHandler = () => {
				titleInfo.current.focused = false;
				updateFrame();
			};
			window.addEventListener('focus', focusHandler);
			window.addEventListener('blur', blurHandler);

			return () => {
				clearInterval(intervalID);
				window.removeEventListener('focus', focusHandler);
				window.removeEventListener('blur', blurHandler);
			};
		}, []);

		return (
			<>
				<title ref={titleRef}>{seo.title}</title>
				<meta name="description" content={seo.description} />
				<meta name="image" content={seo.image} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seo.title} />
				<meta name="twitter:url" content={seo.url} />
				<meta name="twitter:description" content={seo.description} />
				<meta name="twitter:image" content={seo.image} />
				<meta name="twitter:creator" content={seo.twitterUsername} />
				{children}
			</>
		);
	}
);
