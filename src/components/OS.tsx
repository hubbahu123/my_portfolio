import * as React from 'react';

interface OSProps {
	children: React.ReactNode;
}

const OS: React.FC<OSProps> = ({ children }) => {
	return <div className='w-screen h-screen overflow-hidden'>{children}</div>;
};

export default OS;
