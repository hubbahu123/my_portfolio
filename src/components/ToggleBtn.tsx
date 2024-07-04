import { motion } from 'framer-motion';
import React from 'react';

interface ToggleProps {
	state: boolean;
	setter:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((value: boolean) => void);
	children: string;
}

const ToggleBtn: React.FC<ToggleProps> = ({ state, setter, children }) => {
	return (
		<button
			className={`w-full h-full border-2 border-white-primary transition-colors ease-steps bg-black-primary ${state && 'bg-white-primary text-black-primary'}`}
			onClick={() => setter(!state)}
			type="button"
		>
			{children}
		</button>
	);
};

export default ToggleBtn;
