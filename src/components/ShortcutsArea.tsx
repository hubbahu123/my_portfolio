import React, { useState } from 'react';
import Shortcut from './Shortcut';
import { PanInfo, motion, useMotionValue, useTransform } from 'framer-motion';
import { useBreakpointMD } from '../hooks';

interface ShortcutsAreaProps {
	area: React.RefObject<Element>;
}

interface App {
	name: string;
	id: number;
}

const ShortcutsArea: React.FC<ShortcutsAreaProps> = ({ area }) => {
	const isMedium = useBreakpointMD();
	const [apps, setApps] = useState<App[]>(
		Array(5)
			.fill(0)
			.map((_, i) => {
				return { name: `App ${i + 1}`, id: i };
			})
	);

	return (
		<div className='h-full p-2 pb-24'>
			<ul
				className='h-full grid grid-cols-4 grid-rows-2 xs:grid-cols-5 sm:!grid-cols-6 short:grid-rows-3 average:grid-rows-4 tall:grid-rows-5 md:flex md:items-start'
				style={{ gridAutoRows: 0 }}
			>
				{apps.map(({ name, id }) => (
					<motion.li
						key={id}
						drag={isMedium}
						dragConstraints={area}
						dragElastic={0}
						dragMomentum={false}
						className='p-2'
					>
						<Shortcut name={name} />
					</motion.li>
				))}
			</ul>
		</div>
	);
};

export default ShortcutsArea;