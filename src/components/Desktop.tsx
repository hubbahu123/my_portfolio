import * as React from 'react';
import Shortcut from './Shortcut';
import Window from './Window';

const Desktop: React.FC = () => {
	return (
		<main className='w-full h-full relative'>
			<ul className='max-h-full grid grid-cols-4 gap-8 p-8'>
				<li>
					<Shortcut name='App 1' />
				</li>
				<li>
					<Shortcut name='Another App' />
				</li>
				<li>
					<Shortcut name='App 3' />
				</li>
				<li>
					<Shortcut name='Not App 4' />
				</li>
				<li>
					<Shortcut name='App Five' />
				</li>
			</ul>
			<div className='w-full h-full absolute top-0'>
				<Window />
			</div>
		</main>
	);
};

export default Desktop;
