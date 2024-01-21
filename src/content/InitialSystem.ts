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
						{ name: 'Projects', children: [] },
						{ name: 'Contact', ext: 'exe' },
						{ name: 'resume', ext: 'pdf' },
						{
							name: 'Trash',
							children: [{ name: 'SecretFile', ext: 'mys' }],
						},
					],
				},
				{
					name: 'Apps',
					children: [
						{
							name: 'Console',
							ext: 'exe',
						},
					],
				},
			],
		},
	],
};

export default InitialSystem;
