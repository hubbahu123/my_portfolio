import * as React from 'react';
import { createContext } from 'react';
import { useBreakpointMD } from '../utils';

interface OSProps {
	children: React.ReactNode;
}

export const MobileContext = createContext(true);

const OS: React.FC<OSProps> = ({ children }) => {
	const notMobile = useBreakpointMD();
	return (
		<MobileContext.Provider value={!notMobile}>
			<div className='w-screen h-screen overflow-hidden'>{children}</div>
		</MobileContext.Provider>
	);
};

export default OS;
