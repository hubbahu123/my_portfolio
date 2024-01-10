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
						{ name: 'App4', ext: 'pdf' },
						{ name: 'App2', ext: 'pdf' },
						{
							name: 'Empty',
							children: [
								{
									name: 'Console',
									ext: 'exe',
								},
							],
						},
						{
							name: 'Trash',
							children: [{ name: 'App1', ext: 'pdf' }],
						},
					],
				},
				{
					name: 'Apps',
					children: [
						{ name: 'App1', ext: 'pdf' },
						{ name: 'App2', ext: 'pdf' },
						{ name: 'App3', ext: 'pdf' },
					],
				},
			],
		},
	],
};

export default InitialSystem;
