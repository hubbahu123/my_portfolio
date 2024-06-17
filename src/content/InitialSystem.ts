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
						{
							name: 'about_me',
							ext: 'txt',
							value: `uefiywrbgihwrbgihwrbgihwbrihgbwrhigbrewhibgihrwbgihrwbgihr`,
						},
						{ name: 'Contact', ext: 'exe' },
						{ name: 'resume', ext: 'pdf' },
						{
							name: 'Trash',
							children: [{ name: 'WackyVirus', ext: 'mys' }],
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
		{
			name: 'password',
			hidden: true,
			value: `ifoundit123
            
☺☻
☺☻
☺☻
☻☺
☻☺
☺☻
☻☺
☺☻`,
			ext: 'txt',
		},
	],
};

export default InitialSystem;
