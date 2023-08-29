import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Reda OS`,
		siteUrl: `https://www.yourdomain.tld`,
		description: `This site is a 'desktop-like' experience describing the one (and only) Reda Elmountassir`,
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
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
		'gatsby-transformer-remark',
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
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: './src/pages/',
			},
			__key: 'pages',
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
				description: `This site is a 'desktop-like' experience describing the one (and only) Reda Elmountassir`,
				start_url: `/`,
				background_color: `#1f0728`,
				theme_color: `#f9c80e`,
				display: `standalone`,
			},
		},
		'gatsby-plugin-offline',
	],
};

export default config;
