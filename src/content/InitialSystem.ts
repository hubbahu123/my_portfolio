import type { Directory } from '../store/types';

const InitialSystem: Directory = {
	name: 'users',
	children: [
		{
			name: '@redaelmountassir',
			children: [
				{
					name: 'Desktop',
					children: [
						{ name: 'App4', extension: 'exe' },
						{ name: 'App2', extension: 'exe' },
						{ name: 'Empty', children: [] },
					],
				},
				{
					name: 'Apps',
					children: [
						{ name: 'App1', extension: 'exe' },
						{ name: 'App2', extension: 'exe' },
						{ name: 'App3', extension: 'exe' },
					],
				},
			],
		},
	],
};

export default InitialSystem;
