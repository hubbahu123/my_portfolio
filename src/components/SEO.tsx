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

		useEffect(() => {
			document.getElementsByTagName('title')?.textContent = 'test';
		});

		return (
			<>
				<title>{seo.title}</title>
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
