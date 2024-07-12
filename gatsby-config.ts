import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Reda OS`,
		siteUrl: `https://redaos.netlify.app`,
		image: '/logo.png',
		twitterUsername: '@RedaElmo',
		description: `An OS-like experience meant to provide a glimpse into my mind, Reda Elmountassir. I can't wait to get started on any technological project that comes my way.`,
	},
	graphqlTypegen: false,
	plugins: [
		`gatsby-plugin-glslify`,
		'gatsby-plugin-postcss',
		'gatsby-plugin-image',
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/images/icon.png',
			},
		},
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/images/',
			},
			__key: 'images',
		},
		`gatsby-transformer-json`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: 'projects',
				path: `./src/content/projects`,
			},
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: `src/images/logo/logo_512x512.png`,
				icons: [
					{
						src: `src/images/logo/logo.png`,
						sizes: `16x16`,
						type: `image/png`,
					},
					{
						src: `src/images/logo/logo.ico`,
						sizes: `32x32`,
						type: `image/vnd.microsoft.icon`,
					},
					{
						src: `src/images/logo/logo_192x192.png`,
						sizes: `192x192`,
						type: `image/png`,
					},
					{
						src: `src/images/logo/logo_512x512.png`,
						sizes: `512x512`,
						type: `image/png`,
					},
				],
				name: 'RedaOS',
				short_name: 'RedaOS',
				description: `An OS-like experience meant to provide a glimpse into my mind, Reda Elmountassir. I can't wait to get started on any technological project that comes my way.`,
				start_url: `/`,
				background_color: `#1f0728`,
				theme_color: `#f9c80e`,
				display: `standalone`,
			},
		},
		{
			resolve: 'gatsby-plugin-html-attributes',
			options: {
				lang: 'en',
			},
		},
		{
			resolve: 'gatsby-plugin-robots-txt',
			options: {
				host: 'https://redaos.netlify.app',
				policy: [{ userAgent: '*', allow: '/' }],
			},
		},
		'gatsby-plugin-minify',
		'gatsby-plugin-offline',
	],
};

export default config;
