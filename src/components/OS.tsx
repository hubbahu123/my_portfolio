import * as React from 'react';
import { createContext, useEffect } from 'react';
import { useBreakpointMD } from '../utils';
import arrowUp from '../images/arrow_up.png';
import arrowUpActive from '../images/arrow_up_active.png';
import arrowDown from '../images/arrow_down.png';
import arrowDownActive from '../images/arrow_down_active.png';

interface OSProps {
	children: React.ReactNode;
}

export const MobileContext = createContext(true);

const OS: React.FC<OSProps> = ({ children }) => {
	const notMobile = useBreakpointMD();

	//Updates global css properties
	useEffect(() => {
		const documentStyle = document.documentElement.style;
		const updateVH = () =>
			documentStyle.setProperty('--vh-full', `${window.innerHeight}px`);
		window.addEventListener('resize', updateVH);
		window.addEventListener('orientationchange', updateVH);
		updateVH();

		documentStyle.setProperty('--arrow-up', `url("${arrowUp}")`);
		documentStyle.setProperty('--arrow-up-active', `url("${arrowUpActive}")`);
		documentStyle.setProperty('--arrow-down', `url("${arrowDown}")`);
		documentStyle.setProperty(
			'--arrow-down-active',
			`url("${arrowDownActive}")`
		);

		return () => {
			window.removeEventListener('resize', updateVH);
			window.removeEventListener('orientationchange', updateVH);
			documentStyle.removeProperty('--vh-full');
		};
	}, []);

	return (
		<MobileContext.Provider value={!notMobile}>
			<div
				className='w-screen h-screen overflow-hidden'
				style={{ height: 'var(--vh-full, 100vh)' }}
			>
				{children}
			</div>
		</MobileContext.Provider>
	);
};

export default OS;
