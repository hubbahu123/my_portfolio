import { motion } from 'framer-motion';
import React from 'react';

interface ToggleProps {
	state: boolean;
	setter: React.Dispatch<React.SetStateAction<boolean>>;
	children: string;
}

const Toggle: React.FC<ToggleProps> = ({ state, setter, children }) => {
	return (
		<label className="flex items-center justify-between my-2 cursor-pointer">
			{children}
			<input
				type="checkbox"
				name={children}
				checked={state}
				onChange={e => setter(e.target.checked)}
				className="hidden"
			/>
			<div
				className={`w-14 h-6 p-1 ml-4 flex outline outline-2 outline-white-primary transition-colors ease-steps ${
					state &&
					'bg-gradient-to-r from-pink-accent to-blue-accent justify-end'
				}`}
			>
				<motion.div
					className="w-1/2 h-full bg-white-primary shadow-[-2px_-2px_inset] shadow-light-primary"
					layout
					transition={{
						type: 'spring',
						stiffness: 800,
						damping: 30,
					}}
				/>
			</div>
		</label>
	);
};

export default Toggle;
