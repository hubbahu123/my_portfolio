import React, { useContext } from 'react';
import Shortcut from './Shortcut';
import { useBoundStore } from '../store';

interface ShortcutsAreaProps {
	area: React.RefObject<Element>;
}

const ShortcutsArea: React.FC<ShortcutsAreaProps> = ({ area }) => {
	const [desktop, addWindow] = useBoundStore(state => [
		state.navigate('users/@redaelmountassir/Desktop'),
		state.addWindow,
	]);
	const shortcuts = desktop && 'children' in desktop ? desktop.children : [];

	return (
		<div className="h-full p-4 pb-24 md:pt-20 md:pb-4 absolute top-0 pointer-events-none">
			<ul
				className="h-full grid grid-cols-4 grid-rows-2 xs:grid-cols-5 sm:!grid-cols-6 short:grid-rows-3 average:grid-rows-4 tall:grid-rows-5 md:flex md:items-start"
				style={{ gridAutoRows: 0 }}
			>
				{shortcuts.map(shortcut => (
					<li key={shortcut.name} className="pointer-events-auto">
						<Shortcut {...shortcut} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default ShortcutsArea;
